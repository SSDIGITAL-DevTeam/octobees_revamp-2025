import { transporter } from "../../utils/mail.js";
import logger from "../../utils/logger.js";

const fromName = process.env.SMTP_FROM_NAME || "OCTOBEES Team";
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
    logger.error(`Failed to send lead email to ${payload.to}`, {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
};

export const sendInsightPdfEmail = async ({ to, name, pdfFilePath, blogTitle }) => {
  const subject = `Your requested resource: ${blogTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #B3000B;">Hi ${name},</h2>
      <p>Thank you for your interest in our insights content!</p>
      <p>Please find the attached PDF for <strong>${blogTitle}</strong>.</p>
      <p>We hope this resource is valuable to you. If you have any questions or would like to discuss further, feel free to reach out to us.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>OCTOBEES Team</strong></p>
    </div>
  `;
  return sendEmail({
    to,
    subject,
    html,
    attachments: [
      {
        filename: `${blogTitle.replace(/[^a-z0-9]/gi, "_")}.pdf`,
        path: pdfFilePath,
      },
    ],
  });
};
