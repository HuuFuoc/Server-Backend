import nodemailer from 'nodemailer'

export const sendSMTPMail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // Gmail của bạn
      pass: process.env.SMTP_PASSWORD // App Password vừa tạo
    }
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  })
}
