import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY in .env')

export const resend = new Resend(RESEND_API_KEY)

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'
  return resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html
  })
}