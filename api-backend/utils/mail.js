// utils/mailer.js
import nodemailer from "nodemailer";
import logger from "./logger.js";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure =
  process.env.SMTP_SECURE === "true" ||
  String(process.env.SMTP_PORT || "").trim() === "465";
const smtpUser = process.env.SMTP_USER || process.env.USER_EMAIL;
const smtpPass = process.env.SMTP_PASS || process.env.USER_PASSWORD;
const transporterAuth = smtpUser
  ? {
      user: smtpUser,
      pass: smtpPass,
    }
  : undefined;

export const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || undefined,
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: transporterAuth,
});

const defaultFromName = process.env.SMTP_FROM_NAME || "OCTOBEES Team";
const defaultFromEmail = process.env.SMTP_FROM_EMAIL || smtpUser || "no-reply@octobees.com";

export const sendResetEmail = async (to, link) => {
  logger.info(`Sending reset password email to ${to}`);
  logger.info(`Reset password link: ${link}`);
  try {
    const mailOptions = {
      from: `"${defaultFromName}" <${defaultFromEmail}>`,
      to,
      subject: "Reset Your Password",
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
        <p><strong>Octobees</strong><br>Administrator</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }

};
