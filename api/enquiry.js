// /api/enquiry.js
// Vercel serverless function — receives form submissions and forwards via email.
// Uses Resend (free tier) if RESEND_API_KEY is set; otherwise logs and returns success
// so the frontend's WhatsApp fallback can also be used as backup.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  const TO_EMAIL = 'official.unchainedexperience@gmail.com';

  // Basic validation
  if (!data || !data.name || !data.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const lines = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Unchained Experience Website <onboarding@resend.dev>',
          to: [TO_EMAIL],
          reply_to: data.email,
          subject: `New Website Enquiry from ${data.name}`,
          text: lines
        })
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('Resend error:', errText);
        throw new Error('Email send failed');
      }
    } else {
      // No email provider configured yet — log it so it's visible in Vercel logs
      console.log('New enquiry (no RESEND_API_KEY set):', lines);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Enquiry handler error:', err);
    return res.status(500).json({ error: 'Failed to process enquiry' });
  }
}
