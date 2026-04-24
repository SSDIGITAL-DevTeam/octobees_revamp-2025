import { sendMailjetEmail } from "./mailjet.client.js";

const getPartnerLogoUrl = () =>
  `${(process.env.PARTNER_PORTAL_URL || "http://localhost:3002").replace(/\/$/, "")}/asset-logo.webp`;

const JOURNEY_STEPS = [
  { key: "qualification", label: "Qualification" },
  { key: "training", label: "Training Session" },
  { key: "certification", label: "Certification" },
  { key: "onboarded", label: "Onboarded" },
];

export const renderEmailJourneyStepper = (currentStep) => {
  const activeIndex = JOURNEY_STEPS.findIndex(
    (step) => step.key === currentStep,
  );

  const items = JOURNEY_STEPS.map((step, index) => {
    const isCompleted = activeIndex > index;
    const isActive = activeIndex === index;
    const circleBg = isCompleted || isActive ? "#1d4ed8" : "#e5e7eb";
    const circleColor = isCompleted || isActive ? "#ffffff" : "#64748b";
    const cardBorder = isActive
      ? "#1d4ed8"
      : isCompleted
        ? "#86efac"
        : "#e5e7eb";
    const cardBg = isActive ? "#eff6ff" : isCompleted ? "#f0fdf4" : "#f8fafc";
    const labelColor = isActive || isCompleted ? "#0f172a" : "#64748b";

    return `
      <td style="padding: 0 6px 12px 0; vertical-align: top;">
        <div style="border: 1px solid ${cardBorder}; background: ${cardBg}; border-radius: 12px; padding: 12px 10px; text-align: center; min-width: 110px;">
          <div style="width: 28px; height: 28px; line-height: 28px; margin: 0 auto 8px auto; border-radius: 999px; background: ${circleBg}; color: ${circleColor}; font-size: 13px; font-weight: 700;">
            ${isCompleted ? "✓" : index + 1}
          </div>
          <div style="font-size: 12px; line-height: 1.4; font-weight: 600; color: ${labelColor};">
            ${step.label}
          </div>
        </div>
      </td>
    `;
  }).join("");

  return `
    <div style="margin: 24px 0 28px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
          ${items}
        </tr>
      </table>
    </div>
  `;
};

// Base email template wrapper
export const wrapInTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #E30613 0%, #b1050f 100%);
      color: white;
      padding: 30px 40px;
      text-align: center;
    }
    .email-logo {
      display: block;
      height: 44px;
      width: 44px;
      object-fit: contain;
      flex: 0 0 auto;
    }
    .email-brand {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .email-brand-title {
      color: #ffffff;
      font-size: 24px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.16em;
    }
    .email-body {
      padding: 40px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body h2 {
      color: #E30613;
      margin-top: 0;
    }
    .email-body p {
      margin-bottom: 20px;
    }
    .result-badge {
      display: inline-block;
      padding: 10px 25px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 18px;
      margin: 20px 0;
    }
    .result-passed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .result-failed {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .score-display {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .score-display .score-value {
      font-size: 32px;
      font-weight: 700;
      color: #E30613;
    }
    .score-display .score-label {
      color: #6b7280;
      font-size: 14px;
    }
    .credentials-box {
      background-color: #f0f9ff;
      border: 2px solid #0ea5e9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .credentials-box h3 {
      margin-top: 0;
      color: #0369a1;
    }
    .credentials-box code {
      display: block;
      background-color: #e0f2fe;
      padding: 10px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      margin: 10px 0;
      word-break: break-all;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #E30613 0%, #b1050f 100%);
      color: white !important;
      padding: 14px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 10px 5px;
    }
    .button-secondary {
      background: #6b7280;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .email-footer a {
      color: #E30613;
      text-decoration: none;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="email-brand">
        <img src="${getPartnerLogoUrl()}" alt="DIGITAL-PA" class="email-logo" />
        <span class="email-brand-title">DIGITAL-PA</span>
      </div>
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} DIGITAL-PA. All rights reserved.</p>
      <p>
        <a href="#">Privacy Policy</a> | 
        <a href="#">Terms of Service</a> | 
        <a href="#">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Assessment Result Email Template (Passed or Failed)
export const sendAssessmentResultEmail = async (details, result) => {
  const { affiliate, session } = details;

  if (result.isPassed) {
    const content = `
      <h2>Congratulations! You Passed the Assessment! 🎉</h2>
      
      <p>Dear <strong>${affiliate.fullName}</strong>,</p>
      
      <p>We are thrilled to inform you that you have <strong>successfully passed</strong> the Partner Assessment for DIGITAL-PA!</p>
      
      <div class="score-display" style="text-align: center;">
        <div class="score-value">${result.percentage.toFixed(1)}%</div>
        <div class="score-label">Your Score</div>
      </div>
      
      <p>Here are your assessment details:</p>
      <ul>
        <li><strong>Total Score:</strong> ${result.totalScore} / ${result.maxScore}</li>
        <li><strong>Passing Score:</strong> ${result.passingPercentage}%</li>
        <li><strong>Assessment Date:</strong> ${new Date(
          session.submittedAt,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</li>
      </ul>
      
      ${
        result.reviewerNotes
          ? `
        <p><strong>Reviewer's Feedback:</strong></p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          "${result.reviewerNotes}"
        </div>
      `
          : ""
      }
      
      <p>Your partner account has been created and credentials have been sent in a separate email.</p>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="${process.env.PARTNER_PORTAL_URL || "http://localhost:3002"}" class="button">
          Access Partner Portal
        </a>
      </p>
      
      <p>Welcome aboard, and we look forward to a successful partnership!</p>
      
      <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
    `;

    return sendMailjetEmail({
      to: affiliate.email,
      subject:
        "🎉 Congratulations! You Passed the DIGITAL-PA Partner Assessment!",
      htmlPart: wrapInTemplate(content, "Assessment Passed"),
    });
  } else {
    const content = `
      <h2>Assessment Result Notification</h2>
      
      <p>Dear <strong>${affiliate.fullName}</strong>,</p>
      
      <p>Thank you for completing the DIGITAL-PA Partner Assessment. Unfortunately, we regret to inform you that you did not meet the passing criteria this time.</p>
      
      <div style="text-align: center;">
        <span class="result-badge result-failed">Not Passed</span>
      </div>
      
      <div class="score-display" style="text-align: center;">
        <div class="score-value">${result.percentage.toFixed(1)}%</div>
        <div class="score-label">Your Score (${result.passingPercentage}% required to pass)</div>
      </div>
      
      <p>Here are your assessment details:</p>
      <ul>
        <li><strong>Total Score:</strong> ${result.totalScore} / ${result.maxScore}</li>
        <li><strong>Passing Score:</strong> ${result.passingPercentage}%</li>
        <li><strong>Your Score:</strong> ${result.percentage.toFixed(1)}%</li>
        <li><strong>Assessment Date:</strong> ${new Date(
          session.submittedAt,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</li>
      </ul>
      
      ${
        result.reviewerNotes
          ? `
        <p><strong>Feedback from Reviewer:</strong></p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          "${result.reviewerNotes}"
        </div>
      `
          : ""
      }
      
      <p>Don't be discouraged! Many qualified partners have taken the assessment multiple times before succeeding. We encourage you to:</p>
      <ul>
        <li>Review the areas where you can improve</li>
        <li>Study the partner program requirements more thoroughly</li>
        <li>Prepare better for the video introduction</li>
        <li>Practice writing comprehensive essay answers</li>
      </ul>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="${process.env.END_USER_URL || "http://localhost:3000"}/partner" class="button">
          Apply Again
        </a>
        <a href="${process.env.END_USER_URL || "http://localhost:3000"}" class="button button-secondary">
          Learn More About Us
        </a>
      </p>
      
      <p>We believe in your potential and hope to welcome you as a partner in the future!</p>
      
      <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
    `;

    return sendMailjetEmail({
      to: affiliate.email,
      subject: "Assessment Result - DIGITAL-PA Partner Program",
      htmlPart: wrapInTemplate(content, "Assessment Result"),
    });
  }
};

// Welcome Email with Credentials (for passed partners)
export const sendWelcomeEmail = async (affiliate, credentials) => {
  const content = `
    <h2>Welcome to DIGITAL-PA Partner Program! 🎉</h2>
    
    <p>Dear <strong>${affiliate.fullName}</strong>,</p>
    
    <p>Congratulations on passing your assessment! We are excited to welcome you as an official <strong>DIGITAL-PA Partner</strong>.</p>
    
    <p>Your partner account has been successfully created. Here are your login credentials:</p>
    
    <div class="credentials-box">
      <h3>🔐 Your Partner Account Credentials</h3>
      <p><strong>Email:</strong></p>
      <code>${credentials.email}</code>
      
      <p><strong>Temporary Password:</strong></p>
      <code>${credentials.password}</code>
      
      <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
        ⚠️ For security reasons, you will be prompted to change your password after your first login.
      </p>
    </div>
    
    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Click the button below to access the Partner Portal</li>
      <li>Log in with your credentials above</li>
      <li>Complete your profile information</li>
      <li>Set up your payment details for commissions</li>
      <li>Start exploring your partner dashboard!</li>
    </ol>
    
    <p style="text-align: center; margin-top: 30px;">
      <a href="${credentials.loginUrl}" class="button">
        Access Partner Portal Now
      </a>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <h3>As a DIGITAL-PA Partner, you'll enjoy:</h3>
    <ul>
      <li>💰 Competitive commission rates</li>
      <li>📊 Real-time tracking dashboard</li>
      <li>🎯 Dedicated support team</li>
      <li>📚 Access to marketing resources</li>
      <li>🏆 Performance bonuses</li>
    </ul>
    
    <p>If you have any questions, don't hesitate to reach out to our partner support team.</p>
    
    <p>Welcome aboard, and here's to a successful partnership!</p>
    
    <p>Best regards,<br>
    <strong>The DIGITAL-PA Partner Team</strong></p>
  `;

  return sendMailjetEmail({
    to: credentials.email,
    subject:
      "🎉 Welcome to DIGITAL-PA Partner Program - Your Account Details Inside!",
    htmlPart: wrapInTemplate(content, "Welcome to DIGITAL-PA"),
  });
};

export const sendVideoInterviewInvitationEmail = async (
  affiliate,
  { interviewUrl, expiresAt },
) => {
  const accessWindowLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const content = `
    <h2>Congratulations! You've Passed the Initial Screening! 🎉</h2>

    ${renderEmailJourneyStepper("qualification")}
    
    <p>Dear <strong>${affiliate.fullName}</strong>,</p>
    
    <p>Your initial qualification review has been completed successfully, and you are now invited to continue to the <strong>Video Interview</strong> stage.</p>
    
    <p>Please prepare one shareable Google Drive link that contains your full interview recording set, then submit it through the interview page below.</p>
    
    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="margin: 0 0 16px 0; color: #E30613;">Your Video Interview Link</h3>
      <a href="${interviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #E30613 0%, #b1050f 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Continue to Video Interview
      </a>
      <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
        Or copy this link:<br>
        <span style="word-break: break-all; color: #374151;">${interviewUrl}</span>
      </p>
    </div>
    
    <p><strong>What to prepare:</strong></p>
    <ul>
      <li>Record your responses for the full interview question set.</li>
      <li>Upload the recordings to Google Drive and ensure sharing access is enabled.</li>
      <li>Submit one shared link that contains the complete interview materials.</li>
      ${
        accessWindowLabel
          ? `<li>Your current invitation was generated on: <strong>${accessWindowLabel}</strong></li>`
          : ""
      }
    </ul>
    
    <p>Once your interview link is submitted, the system will automatically send the next email for your AI Training stage.</p>
    
    <p>Best regards,<br>
    <strong>The DIGITAL-PA Team</strong></p>
  `;

  return sendMailjetEmail({
    to: affiliate.email,
    subject: "🎥 Continue Your Partner Application: Video Interview Stage",
    htmlPart: wrapInTemplate(content, "Video Interview Invitation"),
  });
};

// AI Training Invitation Email
export const sendTrainingInvitationEmail = async (
  affiliate,
  { examUrl, expiresAt },
) => {
  const accessWindowLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const content = `
    <h2>Your Application Is Moving Forward to AI Training 🎉</h2>

    ${renderEmailJourneyStepper("training")}
    
    <p>Dear <strong>${affiliate.fullName}</strong>,</p>
    
    <p>Thank you for completing the video interview stage. You are now invited to continue to the <strong>AI Training</strong> stage of the partner program.</p>
    
    <p>This stage contains the batch-specific training materials assigned to you, including the configured text or embed modules, training video, PDF review, and any live access references before you proceed to the final assessment.</p>
    
    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="margin: 0 0 16px 0; color: #E30613;">Your AI Training Link</h3>
      <a href="${examUrl}" style="display: inline-block; background: linear-gradient(135deg, #E30613 0%, #b1050f 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Start AI Training
      </a>
      <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
        Or copy this link:<br>
        <span style="word-break: break-all; color: #374151;">${examUrl}</span>
      </p>
    </div>
    
    <p><strong>Important Information:</strong></p>
    <ul>
      <li>This link will take you through the AI Training materials before the final exam stage.</li>
      <li>Make sure you have a stable internet connection before starting.</li>
      <li>After you complete the training stage, the final exam must be finished within the configured deadline in the system.</li>
      ${
        accessWindowLabel
          ? `<li>Your current access window was generated on: <strong>${accessWindowLabel}</strong></li>`
          : ""
      }
    </ul>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>The exact training materials assigned to your batch by the admin team</li>
      <li>Timed multiple choice and essay questions in the final exam stage</li>
    </ul>
    
    <p>Take your time and do your best. We're excited to learn more about you!</p>
    
    <p>If you have any questions or technical issues, please reply to this email.</p>
    
    <p>Best regards,<br>
    <strong>The DIGITAL-PA Team</strong></p>
  `;

  return sendMailjetEmail({
    to: affiliate.email,
    subject: "🎉 You're Invited to Complete Your AI Training Assessment",
    htmlPart: wrapInTemplate(content, "AI Training Assessment Invitation"),
  });
};

export const sendExamInvitationEmail = async (
  affiliate,
  { examUrl, expiresAt },
) => {
  const accessWindowLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const content = `
    <h2>Your Certification Exam Is Ready</h2>

    ${renderEmailJourneyStepper("certification")}

    <p>Dear <strong>${affiliate.fullName}</strong>,</p>

    <p>You have completed the training session successfully and can now continue to the <strong>Certification</strong> stage.</p>

    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="margin: 0 0 16px 0; color: #E30613;">Your Exam Link</h3>
      <a href="${examUrl}" style="display: inline-block; background: linear-gradient(135deg, #E30613 0%, #b1050f 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Continue to Certification Exam
      </a>
      <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
        Or copy this link:<br>
        <span style="word-break: break-all; color: #374151;">${examUrl}</span>
      </p>
    </div>

    <ul>
      <li>You can continue directly from the success screen or use this email link later.</li>
      <li>Your working time will be recorded automatically by the system.</li>
      ${accessWindowLabel ? `<li>Your current exam access window was issued on: <strong>${accessWindowLabel}</strong></li>` : ""}
    </ul>

    <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
  `;

  return sendMailjetEmail({
    to: affiliate.email,
    subject: "📝 Your DIGITAL-PA Certification Exam Is Ready",
    htmlPart: wrapInTemplate(content, "Certification Exam Invitation"),
  });
};

export const sendExamPassedEmail = async (
  affiliate,
  { percentage, passingPercentage },
) => {
  const content = `
    <h2>You Passed the Certification Exam</h2>

    ${renderEmailJourneyStepper("certification")}

    <p>Dear <strong>${affiliate.fullName}</strong>,</p>

    <p>Congratulations. You passed the certification exam and your result has been recorded successfully.</p>

    <div class="score-display" style="text-align: center;">
      <div class="score-value">${Number(percentage || 0).toFixed(1)}%</div>
      <div class="score-label">Passing score: ${Number(passingPercentage || 0)}%</div>
    </div>

    <p>Your result has qualified you for onboarding. The system will complete the onboarding flow automatically and send your partner portal access details by email.</p>

    <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
  `;

  return sendMailjetEmail({
    to: affiliate.email,
    subject: "✅ You Passed the DIGITAL-PA Certification Exam",
    htmlPart: wrapInTemplate(content, "Certification Result"),
  });
};

export const sendExamFailedFinalEmail = async (
  affiliate,
  { percentage, passingPercentage, maxAttempts },
) => {
  const content = `
    <h2>Certification Update</h2>

    ${renderEmailJourneyStepper("certification")}

    <p>Dear <strong>${affiliate.fullName}</strong>,</p>

    <p>Thank you for completing the certification process. You have reached the maximum number of exam attempts for this application.</p>

    <div class="score-display" style="text-align: center;">
      <div class="score-value">${Number(percentage || 0).toFixed(1)}%</div>
      <div class="score-label">Passing score: ${Number(passingPercentage || 0)}% • Attempts used: ${Number(maxAttempts || 2)}</div>
    </div>

    <p>We know this outcome can feel disappointing. Please do not be discouraged. Many strong candidates improve significantly after more preparation and practical experience.</p>

    <p>Take time to strengthen your product understanding, communication clarity, and sales confidence, then feel free to apply again in the future when you are ready.</p>

    <p>Best regards,<br><strong>The DIGITAL-PA Team</strong></p>
  `;

  return sendMailjetEmail({
    to: affiliate.email,
    subject: "DIGITAL-PA Certification Result Update",
    htmlPart: wrapInTemplate(content, "Certification Result Update"),
  });
};
