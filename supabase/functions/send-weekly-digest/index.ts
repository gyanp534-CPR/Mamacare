// Follow this setup guide: https://supabase.com/docs/guides/functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface WeeklyData {
  user_id: string
  email: string
  week: number
  weight_change: string
  mood_summary: string
  upcoming_appointments: number
  baby_fact: string
  tip_of_week: string
}

serve(async (req) => {
  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Get all users who want weekly digest
    const { data: users, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('email_digest_enabled', true)
      .not('email', 'is', null)

    if (error) throw error

    console.log(`Found ${users.length} users for weekly digest`)

    const results = []

    for (const user of users) {
      try {
        const weeklyData = await getWeeklySummary(supabase, user)
        
        if (!weeklyData) {
          console.log(`No data for user ${user.email}`)
          continue
        }

        const emailHtml = renderEmailTemplate(weeklyData)

        // Send email via Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'MamaCare <hello@mamacare.gyanam.shop>',
            to: user.email,
            subject: `Your Week ${weeklyData.week} Pregnancy Update 🌸`,
            html: emailHtml
          })
        })

        const result = await response.json()

        if (response.ok) {
          // Update last digest sent
          await supabase
            .from('user_profile')
            .update({ last_digest_sent_at: new Date().toISOString() })
            .eq('id', user.id)

          results.push({ email: user.email, status: 'sent', id: result.id })
          console.log(`✓ Sent to ${user.email}`)
        } else {
          results.push({ email: user.email, status: 'failed', error: result })
          console.error(`✗ Failed for ${user.email}:`, result)
        }

      } catch (err) {
        console.error(`Error for ${user.email}:`, err)
        results.push({ email: user.email, status: 'error', error: err.message })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: users.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length,
        results
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// ══════════════════════════════════════
// GET WEEKLY SUMMARY DATA
// ══════════════════════════════════════
async function getWeeklySummary(supabase: any, user: any): Promise<WeeklyData | null> {
  try {
    // Calculate current week
    if (!user.due_date && !user.lmp_date) return null

    const dueDate = user.due_date ? new Date(user.due_date) : null
    const lmpDate = user.lmp_date ? new Date(user.lmp_date) : null
    
    if (!dueDate && !lmpDate) return null

    const today = new Date()
    const dueDateObj = dueDate || new Date(lmpDate!.getTime() + 280 * 24 * 60 * 60 * 1000)
    const weeksFromStart = lmpDate 
      ? Math.floor((today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      : Math.floor((dueDateObj.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000))
    
    const week = lmpDate ? weeksFromStart : 40 - weeksFromStart

    if (week < 1 || week > 42) return null // Outside pregnancy range

    // Get weight change (last 7 days)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const { data: weights } = await supabase
      .from('weight_logs')
      .select('weight_kg')
      .eq('user_id', user.id)
      .gte('log_date', weekAgo.toISOString().split('T')[0])
      .order('log_date', { ascending: false })
      .limit(2)

    let weightChange = 'No data this week'
    if (weights && weights.length >= 2) {
      const change = weights[0].weight_kg - weights[1].weight_kg
      weightChange = change >= 0 
        ? `+${change.toFixed(1)} kg` 
        : `${change.toFixed(1)} kg`
    }

    // Get mood summary (last 7 days)
    const { data: moods } = await supabase
      .from('mood_logs')
      .select('mood')
      .eq('user_id', user.id)
      .gte('log_date', weekAgo.toISOString().split('T')[0])

    const moodCounts: Record<string, number> = {}
    moods?.forEach((m: any) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
    })
    const topMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0]
    const moodSummary = topMood 
      ? `Mostly ${topMood} (${moodCounts[topMood]} times)`
      : 'No mood logs this week'

    // Get upcoming appointments (next 14 days)
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', user.id)
      .gte('appointment_date', today.toISOString().split('T')[0])
      .lte('appointment_date', twoWeeksLater.toISOString().split('T')[0])

    // Baby fact for current week
    const babyFact = getBabyFact(week)
    const tipOfWeek = getTipOfWeek(week)

    return {
      user_id: user.id,
      email: user.email,
      week,
      weight_change: weightChange,
      mood_summary: moodSummary,
      upcoming_appointments: appointments?.length || 0,
      baby_fact: babyFact,
      tip_of_week: tipOfWeek
    }

  } catch (err) {
    console.error('Error getting weekly summary:', err)
    return null
  }
}

// ══════════════════════════════════════
// BABY FACTS BY WEEK
// ══════════════════════════════════════
function getBabyFact(week: number): string {
  const facts: Record<number, string> = {
    8: "Your baby is the size of a raspberry 🫐 (~1.6 cm)",
    12: "Baby can open and close tiny fists! 👶",
    16: "Baby is as big as an avocado 🥑 (~11.6 cm)",
    20: "Halfway there! Baby weighs ~300g",
    24: "Baby's lungs are developing rapidly 🫁",
    28: "Baby can recognize your voice! 🎵",
    32: "Baby is practicing breathing movements",
    36: "Baby is getting ready for birth! 🌟",
    40: "Any day now! Baby is full term 🎉"
  }

  // Find closest week
  const weeks = Object.keys(facts).map(Number).sort((a, b) => a - b)
  const closestWeek = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  )

  return facts[closestWeek]
}

// ══════════════════════════════════════
// TIPS BY WEEK
// ══════════════════════════════════════
function getTipOfWeek(week: number): string {
  if (week < 13) return "Stay hydrated and rest whenever you feel tired"
  if (week < 27) return "Start thinking about baby names and nursery setup"
  if (week < 37) return "Pack your hospital bag and finalize your birth plan"
  return "Practice breathing exercises and stay relaxed"
}

// ══════════════════════════════════════
// EMAIL TEMPLATE
// ══════════════════════════════════════
function renderEmailTemplate(data: WeeklyData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Week ${data.week} Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #F9A8C9 0%, #E879A0 100%);">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #E879A0, #A855C8); padding: 40px 32px; text-align: center; color: white;">
      <h1 style="margin: 0 0 8px; font-size: 32px; font-weight: 300;">Week ${data.week} Update</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.95;">Your weekly pregnancy summary 🌸</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px;">
      
      <!-- Baby Fact -->
      <div style="background: linear-gradient(135deg, rgba(232,121,160,0.08), rgba(168,85,200,0.05)); border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #E879A0;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #E879A0;">👶 This Week</h2>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">${data.baby_fact}</p>
      </div>
      
      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 13px; color: #666; margin-bottom: 6px;">Weight Change</div>
          <div style="font-size: 24px; font-weight: 700; color: #E879A0;">${data.weight_change}</div>
        </div>
        <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 13px; color: #666; margin-bottom: 6px;">Mood This Week</div>
          <div style="font-size: 16px; font-weight: 600; color: #333;">${data.mood_summary}</div>
        </div>
      </div>
      
      <!-- Appointments -->
      ${data.upcoming_appointments > 0 ? `
      <div style="background: rgba(255,193,7,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #FFC107;">
        <h3 style="margin: 0 0 8px; font-size: 16px; color: #F57C00;">📅 Upcoming Appointments</h3>
        <p style="margin: 0; font-size: 14px; color: #666;">You have ${data.upcoming_appointments} appointment${data.upcoming_appointments > 1 ? 's' : ''} in the next 2 weeks</p>
      </div>
      ` : ''}
      
      <!-- Tip of the Week -->
      <div style="background: linear-gradient(135deg, rgba(106,184,154,0.08), rgba(93,168,140,0.05)); border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #6AB89A;">
        <h3 style="margin: 0 0 12px; font-size: 18px; color: #6AB89A;">💡 Tip of the Week</h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333;">${data.tip_of_week}</p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://mamacare.gyanam.shop" style="display: inline-block; background: linear-gradient(135deg, #E879A0, #A855C8); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Open MamaCare →
        </a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 24px 32px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #666;">
        You're receiving this because you enabled weekly digests.
      </p>
      <p style="margin: 0; font-size: 12px; color: #999;">
        <a href="https://mamacare.gyanam.shop/settings" style="color: #E879A0; text-decoration: none;">Manage preferences</a> · 
        <a href="https://mamacare.gyanam.shop/unsubscribe?user=${data.user_id}" style="color: #999; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `
}
