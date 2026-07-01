import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface User {
  id: string
  name: string
  email: string
  due_date: string
}

interface WeeklyData {
  user: User
  week: number
  weights: any[]
  moods: any[]
  appointments: any[]
  kicks: any[]
}

serve(async (req) => {
  try {
    console.log('🌸 Starting weekly digest process...')
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get users opted-in for email digest
    const { data: users, error: usersError } = await supabase
      .from('user_profile')
      .select('id, name, email, due_date')
      .eq('email_digest_enabled', true)
      .eq('email_verified', true)
      .not('email', 'is', null)
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }
    
    console.log(`📧 Found ${users?.length || 0} users to send digest`)
    
    const results = []
    const successCount = { sent: 0, failed: 0, skipped: 0 }

    
    for (const user of users || []) {
      try {
        console.log(`Processing user: ${user.email}`)
        
        // Calculate pregnancy week
        if (!user.due_date) {
          console.log(`Skipping ${user.email} - no due date`)
          successCount.skipped++
          continue
        }
        
        const dueDate = new Date(user.due_date)
        const lmp = new Date(dueDate.getTime() - 280 * 86400000)
        const week = Math.min(40, Math.floor((Date.now() - lmp.getTime()) / (7 * 86400000)) + 1)
        
        // Skip if not in pregnancy range
        if (week < 1 || week > 42) {
          console.log(`Skipping ${user.email} - week ${week} out of range`)
          successCount.skipped++
          continue
        }
        
        // Fetch weekly data
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
        const today = new Date().toISOString().split('T')[0]
        
        const [weightData, moodData, apptData, kickData] = await Promise.all([
          supabase.from('weight_logs')
            .select('weight_kg, logged_at')
            .eq('user_id', user.id)
            .gte('logged_at', weekAgo)
            .order('logged_at'),
          
          supabase.from('mood_logs')
            .select('mood_type')
            .eq('user_id', user.id)
            .gte('logged_at', weekAgo),
          
          supabase.from('appointments')
            .select('title, appt_date, doctor_name, location')
            .eq('user_id', user.id)
            .gte('appt_date', today)
            .order('appt_date')
            .limit(3),
          
          supabase.from('kick_logs')
            .select('kick_count, session_date')
            .eq('user_id', user.id)
            .gte('session_date', weekAgo.split('T')[0])
        ])

        
        // Generate HTML email
        const html = generateEmailHTML({
          user,
          week,
          weights: weightData.data || [],
          moods: moodData.data || [],
          appointments: apptData.data || [],
          kicks: kickData.data || []
        })
        
        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Mama Gyan <weekly@mamacare.gyanam.shop>',
            to: user.email,
            subject: `🌸 Week ${week} Summary - Your Pregnancy Journey`,
            html: html
          })
        })
        
        const emailResult = await emailResponse.json()
        
        if (!emailResponse.ok) {
          throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`)
        }
        
        // Update last_digest_sent_at
        await supabase.from('user_profile')
          .update({ last_digest_sent_at: new Date().toISOString() })
          .eq('id', user.id)
        
        console.log(`✅ Sent to ${user.email} - Email ID: ${emailResult.id}`)
        successCount.sent++
        results.push({ 
          user_id: user.id, 
          email: user.email,
          status: 'sent', 
          email_id: emailResult.id 
        })
        
      } catch (userError) {
        console.error(`❌ Error sending to ${user.email}:`, userError)
        successCount.failed++
        results.push({ 
          user_id: user.id, 
          email: user.email,
          status: 'failed', 
          error: userError.message 
        })
      }
    }

    
    console.log('📊 Summary:', successCount)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        total_users: users?.length || 0,
        sent: successCount.sent,
        failed: successCount.failed,
        skipped: successCount.skipped,
        results: results 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateEmailHTML(data: WeeklyData): string {
  const { user, week, weights, moods, appointments, kicks } = data
  
  // Calculate stats
  const weightChange = weights.length >= 2 
    ? (weights[weights.length - 1].weight_kg - weights[0].weight_kg).toFixed(1)
    : '—'
  
  const moodCounts: Record<string, number> = {}
  moods.forEach((m: any) => {
    moodCounts[m.mood_type] = (moodCounts[m.mood_type] || 0) + 1
  })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm'
  
  const avgKicks = kicks.length > 0
    ? Math.round(kicks.reduce((sum: number, k: any) => sum + k.kick_count, 0) / kicks.length)
    : '—'
  
  // Baby development for current week
  const babyDev = getBabyDevelopment(week)

  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Pregnancy Summary</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#fdf6f0;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e8a0a8,#f7c4a8);color:white;padding:40px 30px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:600;">🌸 Weekly Pregnancy Summary</h1>
      <p style="margin:10px 0 0;font-size:16px;opacity:0.95;">Hello ${user.name || 'Beautiful Mama'}!</p>
    </div>
    
    <!-- Content -->
    <div style="padding:30px;">
      
      <!-- Week Badge -->
      <div style="background:linear-gradient(135deg,rgba(232,160,168,0.15),rgba(247,196,168,0.1));border-left:4px solid #e8a0a8;padding:20px;margin-bottom:25px;border-radius:8px;">
        <h2 style="margin:0 0 8px;color:#c97b7b;font-size:20px;">Week ${week} of Your Journey</h2>
        <p style="margin:0;color:#666;line-height:1.6;"><strong>${babyDev.size}</strong> — ${babyDev.fact}</p>
      </div>
      
      <!-- Stats Grid -->
      <table style="width:100%;margin-bottom:25px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:48%;padding:20px;background:#f9f5f2;border-radius:8px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">⚖️</div>
            <div style="font-size:24px;font-weight:700;color:#c97b7b;margin:8px 0 4px;">${weightChange === '—' ? '—' : (parseFloat(weightChange) > 0 ? '+' : '') + weightChange + ' kg'}</div>
            <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Weight Change</div>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding:20px;background:#f9f5f2;border-radius:8px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">😊</div>
            <div style="font-size:24px;font-weight:700;color:#c97b7b;margin:8px 0 4px;">${moods.length}</div>
            <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Mood Logs</div>
          </td>
        </tr>
        <tr><td colspan="3" style="height:15px;"></td></tr>
        <tr>
          <td style="width:48%;padding:20px;background:#f9f5f2;border-radius:8px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">👶</div>
            <div style="font-size:24px;font-weight:700;color:#c97b7b;margin:8px 0 4px;">${avgKicks}</div>
            <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Avg Kicks</div>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding:20px;background:#f9f5f2;border-radius:8px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">💗</div>
            <div style="font-size:24px;font-weight:700;color:#c97b7b;margin:8px 0 4px;">${topMood}</div>
            <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Top Mood</div>
          </td>
        </tr>
      </table>

      
      ${appointments.length > 0 ? `
      <!-- Appointments Section -->
      <div style="margin-bottom:25px;">
        <h3 style="color:#4a2c2a;font-size:18px;margin-bottom:12px;border-bottom:2px solid #e8a0a8;padding-bottom:8px;">📅 Upcoming Appointments</h3>
        ${appointments.map((appt: any) => `
          <div style="background:#fff5f5;padding:15px;margin-bottom:10px;border-radius:6px;border-left:3px solid #e05c5c;">
            <div style="font-weight:600;color:#4a2c2a;margin-bottom:4px;">${appt.title}</div>
            <div style="font-size:13px;color:#666;">
              📆 ${new Date(appt.appt_date).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              ${appt.doctor_name ? ` <br>👨‍⚕️ Dr. ${appt.doctor_name}` : ''}
              ${appt.location ? ` <br>📍 ${appt.location}` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- CTA Section -->
      <div style="text-align:center;padding:30px;background:linear-gradient(135deg,rgba(232,160,168,0.1),rgba(247,196,168,0.08));margin-top:30px;border-radius:8px;">
        <p style="margin:0 0 20px;color:#666;font-size:15px;">Track today's weight, mood, and kicks</p>
        <a href="https://mamacare.gyanam.shop" style="display:inline-block;background:linear-gradient(135deg,#e8a0a8,#f7c4a8);color:white;padding:15px 40px;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;">Open Mama Gyan App →</a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background:#fdf6f0;padding:25px 30px;text-align:center;color:#888;font-size:13px;">
      <p style="margin:0 0 10px;">You're receiving this because you enabled weekly email digests.</p>
      <p style="margin:0 0 15px;">
        <a href="https://mamacare.gyanam.shop/settings" style="color:#c97b7b;text-decoration:none;">Manage preferences</a> • 
        <a href="https://mamacare.gyanam.shop/unsubscribe?user_id=${user.id}" style="color:#c97b7b;text-decoration:none;">Unsubscribe</a>
      </p>
      <p style="margin:15px 0 0;">
        Made with 💗 by <strong>Mama Gyan</strong><br>
        <a href="https://mamacare.gyanam.shop" style="color:#c97b7b;text-decoration:none;">mamacare.gyanam.shop</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `
}


function getBabyDevelopment(week: number): { size: string, fact: string } {
  const developments: Record<number, { size: string, fact: string }> = {
    8: { size: 'Raspberry size (~1.6cm)', fact: 'Tiny fingers and toes are forming! Heart is beating 150+ times per minute.' },
    12: { size: 'Lime size (~5.4cm)', fact: 'First trimester complete! Baby can now make tiny movements.' },
    16: { size: 'Avocado size (~11.6cm)', fact: 'Baby can make facial expressions and might start hiccuping!' },
    20: { size: 'Banana size (~16.4cm)', fact: 'Halfway there! Baby can hear your voice now. Talk and sing!' },
    24: { size: 'Corn size (~30cm)', fact: 'Lungs are developing rapidly. Baby responds to sounds from outside.' },
    28: { size: 'Eggplant size (~37cm)', fact: 'Third trimester! Baby can dream and open/close eyes.' },
    32: { size: 'Pineapple size (~42cm)', fact: 'Baby is storing fat and brain is developing rapidly.' },
    36: { size: 'Coconut size (~47cm)', fact: 'Almost ready! Baby is practicing breathing movements.' },
    40: { size: 'Watermelon size (~51cm)', fact: 'Full term! Baby can arrive any day now. You got this!' }
  }
  
  // Find closest week
  const weeks = Object.keys(developments).map(Number).sort((a, b) => a - b)
  const closest = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  )
  
  return developments[closest]
}
