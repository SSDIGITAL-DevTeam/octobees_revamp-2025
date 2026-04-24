import nodemailer from "nodemailer";
import logger from "../../utils/logger.js";

const DEFAULT_SENDER_EMAIL = "no-reply@digital-pa.com.sg";
const DEFAULT_SENDER_NAME = "DIGITAL-PA";
let transporter;

const readEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const parseBoolean = (value, fallback = false) => {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
};

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getSmtpConfig = () => ({
  host: readEnv("SMTP_HOST"),
  port: parseInteger(readEnv("SMTP_PORT"), 465),
  secure: parseBoolean(readEnv("SMTP_SECURE"), true),
  user: readEnv("SMTP_USER"),
  pass: readEnv("SMTP_PASS"),
  from: readEnv("SMTP_FROM"),
});

const parseFromValue = (value) => {
  if (!value) return null;
  const match = value.match(/^(?:"?([^"]*)"?\s)?<?([^<>]+@[^<>]+)>?$/);
  if (!match) return { Email: value };
  const [, name, email] = match;
  return {
    Email: email.trim(),
    Name: name?.trim() || undefined,
  };
};

const getDefaultSender = () => ({
  ...(parseFromValue(readEnv("SMTP_FROM")) || {}),
  Email:
    parseFromValue(readEnv("SMTP_FROM"))?.Email ||
    readEnv("SMTP_SENDER_EMAIL") ||
    DEFAULT_SENDER_EMAIL,
  Name:
    parseFromValue(readEnv("SMTP_FROM"))?.Name ||
    readEnv("SMTP_SENDER_NAME") ||
    DEFAULT_SENDER_NAME,
});

const getDefaultReplyTo = () => {
  const email = readEnv("SMTP_REPLY_TO_EMAIL");
  if (!email) return null;

  return {
    Email: email,
    Name: readEnv("SMTP_REPLY_TO_NAME", "SMTP_SENDER_NAME") || DEFAULT_SENDER_NAME,
  };
};

const toTextPart = (html = "") =>
  String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

const normalizeRecipient = (recipient) => {
  if (!recipient) return null;
  if (typeof recipient === "string") return { Email: recipient };
  if (typeof recipient === "object" && recipient.email) {
    return {
      Email: recipient.email,
      Name: recipient.name || recipient.Name || undefined,
    };
  }
  if (typeof recipient === "object" && recipient.Email) {
    return {
      Email: recipient.Email,
      Name: recipient.Name || undefined,
    };
  }
  return null;
};

const normalizeRecipients = (recipients) => {
  if (!recipients) return [];
  const list = Array.isArray(recipients) ? recipients : [recipients];
  return list
    .flatMap((recipient) =>
      typeof recipient === "string"
        ? recipient
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [recipient],
    )
    .map(normalizeRecipient)
    .filter(Boolean);
};

const normalizeAttachments = (attachments) => {
  if (!attachments) return undefined;
  const list = Array.isArray(attachments) ? attachments : [attachments];
  const normalized = list
    .map((attachment) => {
      const filename = attachment?.Filename || attachment?.filename;
      const base64Content = attachment?.Base64Content || attachment?.base64Content;
      if (!base64Content || !filename) return null;
      return {
        filename,
        contentType: attachment.ContentType || attachment.contentType || "application/octet-stream",
        content: base64Content,
        encoding: "base64",
        cid: attachment.ContentID || attachment.contentId || undefined,
      };
    })
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
};

const getClient = () => {
  const { host, port, secure, user, pass } = getSmtpConfig();
  if (!host || !user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
};

export const sendMailjetEmail = async ({
  to,
  cc,
  bcc,
  subject,
  htmlPart,
  textPart,
  from,
  replyTo,
  attachments,
  customId,
  sandboxMode,
}) => {
  const client = getClient();
  const isProduction = process.env.NODE_ENV === "production";
  const sendingDisabled = parseBoolean(readEnv("SMTP_DISABLE_SEND"), false);

  if (sendingDisabled) {
    logger.warn("SMTP_DISABLE_SEND is enabled. Skipping email delivery.", { subject });
    return { success: true, skipped: true, reason: "disabled" };
  }

  if (!client) {
    if (isProduction) {
      throw new Error("SMTP credentials are not configured");
    }

    logger.warn("SMTP credentials are not configured, email will be logged only.", { subject, to });
    return { success: true, skipped: true, reason: "missing_credentials" };
  }

  const normalizedTo = normalizeRecipients(to);
  const normalizedCc = normalizeRecipients(cc);
  const normalizedBcc = normalizeRecipients(bcc);
  const normalizedFrom = from
    ? {
        Email: from.Email || from.email,
        Name: from.Name || from.name,
      }
    : getDefaultSender();
  const normalizedReplyTo = replyTo
    ? {
        Email: replyTo.Email || replyTo.email,
        Name: replyTo.Name || replyTo.name,
      }
    : getDefaultReplyTo();
  const normalizedAttachments = normalizeAttachments(attachments);

  if (normalizedTo.length === 0) {
    throw new Error("At least one recipient is required");
  }

  if (sandboxMode ?? parseBoolean(readEnv("SMTP_SANDBOX_MODE"), false)) {
    logger.warn("SMTP sandbox/disable mode active. Skipping email delivery.", { subject });
    return { success: true, skipped: true, reason: "sandbox" };
  }

  const message = {
    from: normalizedFrom.Name ? `"${normalizedFrom.Name}" <${normalizedFrom.Email}>` : normalizedFrom.Email,
    to: normalizedTo.map((recipient) =>
      recipient.Name ? `"${recipient.Name}" <${recipient.Email}>` : recipient.Email,
    ),
    cc: normalizedCc.length
      ? normalizedCc.map((recipient) => (recipient.Name ? `"${recipient.Name}" <${recipient.Email}>` : recipient.Email))
      : undefined,
    bcc: normalizedBcc.length
      ? normalizedBcc.map((recipient) =>
          recipient.Name ? `"${recipient.Name}" <${recipient.Email}>` : recipient.Email,
        )
      : undefined,
    subject,
    html: htmlPart,
    text: textPart || toTextPart(htmlPart),
    replyTo: normalizedReplyTo
      ? normalizedReplyTo.Name
        ? `"${normalizedReplyTo.Name}" <${normalizedReplyTo.Email}>`
        : normalizedReplyTo.Email
      : undefined,
    attachments: normalizedAttachments,
    headers: customId ? { "X-Custom-ID": customId } : undefined,
  };

  try {
    const result = await client.sendMail(message);

    logger.info("Email sent successfully via SMTP", {
      subject,
      messageId: result?.messageId || null,
    });

    return {
      success: true,
      status: "sent",
      messageId: result?.messageId || null,
    };
  } catch (error) {
    logger.error("SMTP email error:", error);
    throw error;
  }
};

export const buildMailjetAttachment = ({ filename, contentType, base64Content, contentId }) => ({
  Filename: filename,
  ContentType: contentType || "application/octet-stream",
  Base64Content: base64Content,
  ContentID: contentId || undefined,
});

export const getMailjetLeadRecipients = () => ({
  to: readEnv("NOTIFICATIONS_TO_EMAIL"),
  cc: readEnv("NOTIFICATIONS_CC_EMAIL"),
});
