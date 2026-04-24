import logger from "../../utils/logger.js";
import { sendMailjetEmail } from "../email/mailjet.client.js";
import {
  renderEmailJourneyStepper,
  wrapInTemplate,
} from "../email/email.service.js";

const getFromName = () =>
  process.env.SMTP_SENDER_NAME || "DIGITAL-PA Partner Team";
const getFromEmail = () =>
  process.env.SMTP_FROM ||
  process.env.SMTP_SENDER_EMAIL ||
  "no-reply@digital-pa.com.sg";
const getPartnerPortalUrl = () =>
  (process.env.PARTNER_PORTAL_URL || "http://localhost:3002").replace(
    /\/$/,
    "",
  );

const sendEmail = async (options) => {
  try {
    await sendMailjetEmail({
      to: options.to,
      subject: options.subject,
      htmlPart: options.html,
      from: {
        Email: getFromEmail(),
        Name: getFromName(),
      },
    });
    return true;
  } catch (error) {
    logger.error(`Failed to send partner email: ${error.message}`);
    throw error;
  }
};

export const sendAffiliateApprovedEmail = async (
  affiliate,
  changePasswordUrl,
) => {
  const partnerPortalUrl = getPartnerPortalUrl();
  const subject = "Your DIGITAL-PA Partner Account is Ready";
  const content = `
    <h2>Your Partner Account Is Ready 🎉</h2>

    ${renderEmailJourneyStepper("onboarded")}

    <p>Dear <strong>${affiliate.fullName}</strong>,</p>

    <p>Congratulations. Your partner application has been approved and your partner portal account is now ready.</p>

    <p>To keep your account secure, please create your own password using the one-time setup link below.</p>

    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="margin: 0 0 16px 0; color: #E30613;">Your Password Setup Link</h3>
      <a href="${changePasswordUrl}" style="display: inline-block; background: linear-gradient(135deg, #E30613 0%, #b1050f 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Create My Password
      </a>
      <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
        Or copy this link:<br>
        <span style="word-break: break-all; color: #374151;">${changePasswordUrl}</span>
      </p>
    </div>

    <p><strong>Login Details:</strong></p>
    <ul>
      <li>Email for login: <strong>${affiliate.email}</strong></li>
      <li>Password: create your own password from the secure link above</li>
    </ul>

    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Open the password setup link above.</li>
      <li>Create your new password.</li>
      <li>Return to the partner portal login page: <a href="${partnerPortalUrl}">${partnerPortalUrl}</a></li>
      <li>Log in using your email and the new password you just created.</li>
    </ol>

    <p>This secure link is time-limited and can only be used once.</p>
    <p>If you did not request this account, please contact our support immediately.</p>

    <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
  `;
  return sendEmail({
    to: affiliate.email,
    subject,
    html: wrapInTemplate(content, "Partner Account Ready"),
  });
};

export const sendAffiliateRejectedEmail = async (affiliate, rejectionNote) => {
  const subject = "DIGITAL-PA Partner Application Update";
  const content = `
    <h2>Application Update</h2>
    <p>Hi ${affiliate.fullName},</p>
    <p>Thank you for applying to the DIGITAL-PA Partner Program. At this time we are unable to approve your application.</p>
    <p><strong>Reason:</strong> ${rejectionNote}</p>
    <p>You can re-apply in the future when the requirements have been updated.</p>
    <p>Regards,<br/>DIGITAL-PA Team</p>
  `;
  return sendEmail({
    to: affiliate.email,
    subject,
    html: wrapInTemplate(content, "Application Update"),
  });
};

export const sendAffiliatePasswordResetEmail = async (affiliate, resetUrl) => {
  const subject = "Reset Your DIGITAL-PA Partner Password";
  const content = `
    <h2>Reset Your Password</h2>
    <p>Hi ${affiliate.fullName},</p>
    <p>We received a request to reset the password for your partner account. You can set a new password by clicking the link below (valid for the next 60 minutes):</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p style="word-break: break-all;">${resetUrl}</p>
    <p>If you didn't request this change, please ignore this email.</p>
    <p>Regards,<br/>DIGITAL-PA Team</p>
  `;
  return sendEmail({
    to: affiliate.email,
    subject,
    html: wrapInTemplate(content, "Reset Password"),
  });
};
