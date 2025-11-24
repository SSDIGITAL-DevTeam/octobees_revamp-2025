import { transporter } from "../../utils/mail.js";
import logger from "../../utils/logger.js";

const fromName = process.env.SMTP_FROM_NAME || "OCTOBEES Affiliate Team";
const fromEmail =
  process.env.SMTP_FROM_EMAIL ||
  process.env.SMTP_USER ||
  process.env.USER_EMAIL ||
  "no-reply@octobees.com";

const sendEmail = async (options) => {
  const payload = {
    from: `"${fromName}" <${fromEmail}>`,
    ...options,
  };
  try {
    await transporter.sendMail(payload);
    return true;
  } catch (error) {
    logger.error(`Failed to send affiliate email to ${payload.to}`, { error });
    throw error;
  }
};

export const sendAffiliateApprovedEmail = async (affiliate, tempPassword, changePasswordUrl) => {
  const subject = "Your OCTOBEES Affiliate Account is Ready";
  const html = `
    <p>Hi ${affiliate.fullName},</p>
    <p>Congratulations! Your affiliate application has been approved.</p>
    <p>You can now access the affiliate dashboard using the credentials below:</p>
    <ul>
      <li>Email: <strong>${affiliate.email}</strong></li>
      <li>Temporary Password: <strong>${tempPassword}</strong></li>
    </ul>
    <p>Please set a new password within 24 hours for security purposes by visiting the link below:</p>
    <p><a href="${changePasswordUrl}">${changePasswordUrl}</a></p>
    <p>If you did not request this account, please contact our support immediately.</p>
    <p>Regards,<br/>OCTOBEES Team</p>
  `;
  return sendEmail({ to: affiliate.email, subject, html });
};

export const sendAffiliateRejectedEmail = async (affiliate, rejectionNote) => {
  const subject = "OCTOBEES Affiliate Application Update";
  const html = `
    <p>Hi ${affiliate.fullName},</p>
    <p>Thank you for applying to the OCTOBEES Affiliate Program. At this time we are unable to approve your application.</p>
    <p><strong>Reason:</strong> ${rejectionNote}</p>
    <p>You can re-apply in the future when the requirements have been updated.</p>
    <p>Regards,<br/>OCTOBEES Team</p>
  `;
  return sendEmail({ to: affiliate.email, subject, html });
};

export const sendAffiliatePasswordResetEmail = async (affiliate, resetUrl) => {
  const subject = "Reset Your OCTOBEES Affiliate Password";
  const html = `
    <p>Hi ${affiliate.fullName},</p>
    <p>We received a request to reset the password for your affiliate account. You can set a new password by clicking the link below (valid for the next 60 minutes):</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you didn't request this change, please ignore this email.</p>
    <p>Regards,<br/>OCTOBEES Team</p>
  `;
  return sendEmail({ to: affiliate.email, subject, html });
};
