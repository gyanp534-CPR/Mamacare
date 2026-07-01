// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

    // Get all users who want weekly digest (email_digest_enabled = true)
    const { data: users, error: usersError } = await supabase
      .from('user_profile')
      .select('id, email, name, due_date, email_digest_enabled')
      .eq('email_digest_enabled', true)

    if (usersError) throw usersError

    const results = []

    for (const user of users || []) {
      try {
        // Calculate pregnancy week
        let week = '—'
        let daysLeft = '—'
        if (user.due_date) {
          const due = new Date(user.due_date)
          const now = new Date()
          const daysFromStart = Math.floor((now.getTime() - (due.getTime() - 280 * 86400000)) / 86400000)
          week = Math.min(40, Math.floor(daysFromStart / 7) + 1)
          daysLeft = Math.max(0, Math.round((due.getTime() - now.getTime()) / 86400000))
        }

        // Get last 7 days data
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

        // Weight trend
        const { data: weights } = await supabase
          .from('weight_logs')
          .select('weight_kg, logged_at')
          .eq('user_id', user.id)
          .gte('logged_at', weekAgo)
          .order('logged_at', { ascending: true })

        // Mood summary
        const { data: moods } = await supabase
          .from('mood_logs')
          .select('mood_type')
          .eq('user_id', user.id)
          .gte('logged_at', weekAgo)

        // Upcoming appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('title, appt_date, doctor_name')
          .eq('user_id', user.id)
          .gte('appt_date', new Date().toISOString().split('T')[0])
          .order('appt_date')
          .limit(3)

        // Sleep average
        const { data: sleeps } = await supabase
          .from('sleep_logs')
          .select('sleep_hours')
          .eq('user_id', user.id)
          .gte('logged_at', weekAgo)

        // Generate email HTML
        const emailHtml = generateWeeklyDigestEmail({
          name: user.name || 'Mama',
          week,
          daysLeft,
          weights: weights || [],
          moods: moods || [],
          appointments: appointments || [],
          sleeps: sleeps || [],
        })

        // Send email via Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mama Gyan <digest@mamacare.gyanam.shop>',
            to: user.email,
            subject: `🌸 Week ${week} Summary - Your Pregnancy Journey`,
            html: emailHtml,
          }),
        })

        const resendData = await resendResponse.json()

        if (resendResponse.ok) {
          results.push({ user_id: user.id, email: user.email, status: 'sent', message_id: resendData.id })
        } else {
          results.push({ user_id: user.id, email: user.email, status: 'failed', error: resendData.message })
        }
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError)
        results.push({ user_id: user.id, email: user.email, status: 'error', error: userError.message })
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Weekly digest error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

function generateWeeklyDigestEmail(data: any) {
  const { name, week, daysLeft, weights, moods, appointments, sleeps } = data

  // Calculate weight change
  let weightTrend = ''
  if (weights.length >= 2) {
    const change = weights[weights.length - 1].weight_kg - weights[0].weight_kg
    const changeStr = change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1)
    weightTrend = `<p style="font-size:14px;color:#666;margin:8px 0">Weight change this week: <strong style="color:#e8a0a8">${changeStr} kg</strong></p>`
  } else if (weights.length === 1) {
    weightTrend = `<p style="font-size:14px;color:#666;margin:8px 0">Current weight: <strong style="color:#e8a0a8">${weights[0].weight_kg} kg</strong></p>`
  }

  // Mood summary
  const moodCounts: any = {}
  moods.forEach((m: any) => {
    moodCounts[m.mood_type] = (moodCounts[m.mood_type] || 0) + 1
  })
  const topMoods = Object.entries(moodCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3)
    .map(([mood]) => mood)

  const moodEmojis: any = {
    happy: '😊', excited: '🥰', anxious: '😰', sad: '😢',
    angry: '😤', tired: '😴', nauseous: '🤢', overwhelmed: '🌊',
    scared: '😨', lonely: '🥺'
  }

  // Sleep average
  const avgSleep = sleeps.length > 0
    ? (sleeps.reduce((sum: number, s: any) => sum + s.sleep_hours, 0) / sleeps.length).toFixed(1)
    : '—'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Pregnancy Summary</title>
</head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:white">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#e8a0a8,#f7c4a8);padding:40px 30px;text-align:center">
        <h1 style="margin:0;color:white;font-size:28px;font-weight:300;letter-spacing:-0.5px">🌸 Your Weekly Summary</h1>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px">Week ${week} • ${daysLeft} days to go</p>
      </td>
    </tr>

    <!-- Greeting -->
    <tr>
      <td style="padding:30px 30px 20px">
        <p style="margin:0;font-size:16px;color:#4a2c2a;line-height:1.6">Namaste ${name}! 🌸</p>
        <p style="margin:12px 0 0;font-size:15px;color:#666;line-height:1.7">Here's what happened this week in your pregnancy journey:</p>
      </td>
    </tr>

    <!-- Weight Section -->
    ${weights.length > 0 ? `
    <tr>
      <td style="padding:20px 30px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:12px;padding:20px">
          <tr>
            <td>
              <h2 style="margin:0 0 12px;color:#d97706;font-size:18px;font-weight:600">⚖️ Weight Tracking</h2>
              ${weightTrend}
              <p style="font-size:13px;color:#999;margin:8px 0 0">Logged ${weights.length} time${weights.length > 1 ? 's' : ''} this week</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- Mood Section -->
    ${moods.length > 0 ? `
    <tr>
      <td style="padding:20px 30px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3e8ff;border-radius:12px;padding:20px">
          <tr>
            <td>
              <h2 style="margin:0 0 12px;color:#7c3aed;font-size:18px;font-weight:600">💗 Mood This Week</h2>
              <p style="font-size:14px;color:#666;margin:8px 0">You felt: ${topMoods.map(m => moodEmojis[m] + ' ' + m).join(', ')}</p>
              <p style="font-size:13px;color:#999;margin:8px 0 0">Logged ${moods.length} mood${moods.length > 1 ? 's' : ''}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- Sleep Section -->
    ${sleeps.length > 0 ? `
    <tr>
      <td style="padding:20px 30px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#dbeafe;border-radius:12px;padding:20px">
          <tr>
            <td>
              <h2 style="margin:0 0 12px;color:#2563eb;font-size:18px;font-weight:600">🌙 Sleep Average</h2>
              <p style="font-size:14px;color:#666;margin:8px 0"><strong style="color:#2563eb;font-size:24px">${avgSleep}</strong> hours per night</p>
              <p style="font-size:13px;color:#999;margin:8px 0 0">Logged ${sleeps.length} night${sleeps.length > 1 ? 's' : ''}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- Appointments Section -->
    ${appointments.length > 0 ? `
    <tr>
      <td style="padding:20px 30px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#dcfce7;border-radius:12px;padding:20px">
          <tr>
            <td>
              <h2 style="margin:0 0 12px;color:#16a34a;font-size:18px;font-weight:600">📅 Upcoming Appointments</h2>
              ${appointments.map((a: any) => `
                <div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05)">
                  <p style="margin:0;font-size:14px;color:#333;font-weight:600">${a.title}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#666">${new Date(a.appt_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}${a.doctor_name ? ' • Dr. ' + a.doctor_name : ''}</p>
                </div>
              `).join('')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- CTA -->
    <tr>
      <td style="padding:30px;text-align:center">
        <p style="margin:0 0 20px;font-size:15px;color:#666">Keep tracking your journey!</p>
        <a href="https://mamacare.gyanam.shop" style="display:inline-block;background:linear-gradient(135deg,#e8a0a8,#f7c4a8);color:white;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600">Open Mama Gyan</a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:20px 30px;background:#fdf6f0;text-align:center;border-top:1px solid #e8a0a8">
        <p style="margin:0;font-size:12px;color:#999">You're receiving this because you enabled weekly digests in Mama Gyan</p>
        <p style="margin:8px 0 0;font-size:12px"><a href="https://mamacare.gyanam.shop" style="color:#e8a0a8;text-decoration:none">Manage preferences</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
