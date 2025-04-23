// utils/mailer.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '79a044f319a464', // Ganti sesuai akun Mailtrap kamu
    pass: '07ae0b0b200e9f',
  },
})

export const sendResetEmail = async (to, link) => {
  const mailOptions = {
    from: '"Ryan Kusuma" <cihuy@example.com>',
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your account password. Click the button below to proceed:</p>
        <a href="${link}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <p><strong>Note:</strong> This link will expire in 15 minutes for your security.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Ryan Kusuma</strong><br>Administrator</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
