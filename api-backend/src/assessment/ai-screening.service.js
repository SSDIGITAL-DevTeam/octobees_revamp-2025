import OpenAI from 'openai';
import { db } from '../../drizzle/db.js';
import { affiliateApplication, affiliateBatch, assessmentSession } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';
import { getAssessmentSettings } from './assessment.repository.js';

const getGeminiApiKey = () => process.env.GEMINI_API_KEY;
const getGeminiModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const getGeminiBaseUrl = () =>
  process.env.GEMINI_OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/';

const getExamPassingScoreForAffiliate = async (affiliateId) => {
  const [affiliate] = await db
    .select({
      batchExamPassingScore: affiliateBatch.examPassingScore,
    })
    .from(affiliateApplication)
    .leftJoin(affiliateBatch, eq(affiliateApplication.batchId, affiliateBatch.id))
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  return Number(affiliate?.batchExamPassingScore || 70);
};

const SALES_EXPERIENCE_POINTS = {
  '0-1': 25,
  '1-3': 45,
  '3-5': 65,
  '5-10': 82,
  '10+': 92,
};

const INCOME_GOAL_SCORE = {
  '$500': 35,
  '$1K': 48,
  '$3K': 68,
  '$5K': 82,
  '$10K+': 92,
};

const SALES_STYLE_SCORE = {
  consultative: 90,
  hybrid: 82,
  relationship: 72,
  aggressive: 55,
};

const OCCUPATION_KEYWORDS = [
  { pattern: /sales|account executive|account manager|business development|bd/i, score: 92 },
  { pattern: /marketing|growth|partnership|partnerships/i, score: 78 },
  { pattern: /customer success|consultant|consulting|agency/i, score: 70 },
  { pattern: /entrepreneur|founder|owner/i, score: 68 },
];

const SCREENING_SYSTEM_PROMPT = `
Evaluate affiliate-sales candidate fit from exactly 6 fields: currentOccupation, salesExperience, hasSoldSaaS, salesStyle, incomeGoal, whyChoose.
Weight factors dynamically. whyChoose is critical: penalize generic, vague, low-effort, or purely motivational answers; reward specific, commercially relevant, persuasive evidence of fit.
Return STRICT JSON only:
{
  "factorScores": {
    "currentOccupation": number,
    "salesExperience": number,
    "hasSoldSaaS": number,
    "salesStyle": number,
    "incomeGoal": number,
    "whyChoose": number
  },
  "overallScore": number,
  "recommendation": "strong_candidate" | "qualified_candidate" | "borderline_candidate" | "not_recommended",
  "hiringSignal": "high" | "medium" | "low",
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "decisionRationale": string,
  "weightRationale": string,
  "whyChooseAssessment": string
}
Prioritize consultative selling, SaaS readiness, coachability, communication quality, and motivation clarity.
Keep summary and rationale concise. strengths/weaknesses: 2-4 short items.
`.trim();

const BATCH_SCREENING_SYSTEM_PROMPT = `
Review a compacted batch of affiliate applicants after individual screening.
Set one evidence-based passingThreshold, label each candidate Qualified or Unqualified, and produce a brief batch summary.
whyChoose quality must strongly influence decisions; generic motivation should usually fail unless the rest is exceptionally strong.
Return STRICT JSON only:
{
  "passingThreshold": number,
  "summary": string,
  "decisionRationale": string,
  "qualifiedCount": number,
  "unqualifiedCount": number,
  "topSignals": string[],
  "riskSignals": string[],
  "candidateDecisions": [
    {
      "affiliateId": string,
      "label": "Qualified" | "Unqualified",
      "reason": string
    }
  ]
}
`.trim();

const getOpenAICompatibleClient = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: getGeminiBaseUrl(),
  });
};

const safeJsonParse = (value) => {
  if (!value || typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const normalizeList = (value, fallback = []) => {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 4);
};

const compactText = (value, maxLength = 360) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
};

const compactList = (value, maxItems = 3, maxLength = 140) =>
  normalizeList(value)
    .slice(0, maxItems)
    .map((item) => compactText(item, maxLength));

const compactCandidateForBatch = (candidate) => ({
  affiliateId: candidate.affiliateId,
  fullName: compactText(candidate.fullName, 80),
  overallScore: clampScore(candidate.overallScore),
  configuredPassingScore: clampScore(candidate.configuredPassingScore, 80),
  factorScores: candidate.factorScores || {},
  recommendation: candidate.recommendation || '',
  summary: compactText(candidate.summary, 260),
  strengths: compactList(candidate.strengths, 3, 120),
  weaknesses: compactList(candidate.weaknesses, 3, 120),
  decisionRationale: compactText(candidate.decisionRationale, 280),
  whyChooseAssessment: compactText(candidate.whyChooseAssessment, 220),
  profileSignals: {
    currentOccupation: compactText(candidate.currentOccupation, 90),
    salesExperience: compactText(candidate.salesExperience, 40),
    hasSoldSaaS: compactText(candidate.hasSoldSaaS, 20),
    salesStyle: compactText(candidate.salesStyle, 40),
    incomeGoal: compactText(candidate.incomeGoal, 30),
  },
});

const clampScore = (value, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, Math.round(parsed)));
};

const scoreOccupation = (occupation) => {
  const text = String(occupation || '').trim();
  if (!text) return 35;

  const matched = OCCUPATION_KEYWORDS.find((item) => item.pattern.test(text));
  return matched?.score || 58;
};

const scoreWhyChoose = (whyChoose) => {
  const text = String(whyChoose || '').trim();
  if (!text) return 20;

  const words = text.split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.min(70, words * 1.4);
  const qualityBonus =
    /sales|client|growth|lead|relationship|closing|pipeline|consultative|AI|automation|SME/i.test(text)
      ? 18
      : 8;

  return Math.min(100, Math.round(lengthScore + qualityBonus));
};

const buildFallbackAnalysis = (data) => {
  const factorScores = {
    currentOccupation: scoreOccupation(data.occupation),
    salesExperience: SALES_EXPERIENCE_POINTS[data.salesExperience] || 28,
    hasSoldSaaS: data.hasSoldSaaS === 'yes' ? 90 : 42,
    salesStyle: SALES_STYLE_SCORE[data.salesStyle] || 55,
    incomeGoal: INCOME_GOAL_SCORE[data.incomeGoal] || 45,
    whyChoose: scoreWhyChoose(data.whyChoose),
  };

  const weightedScore = Math.round(
    factorScores.currentOccupation * 0.14 +
      factorScores.salesExperience * 0.22 +
      factorScores.hasSoldSaaS * 0.18 +
      factorScores.salesStyle * 0.14 +
      factorScores.incomeGoal * 0.10 +
      factorScores.whyChoose * 0.22,
  );

  const strengths = [];
  const weaknesses = [];

  if (factorScores.salesExperience >= 70) strengths.push('Shows solid prior selling exposure.');
  if (factorScores.hasSoldSaaS >= 70) strengths.push('Already familiar with SaaS or software selling dynamics.');
  if (factorScores.salesStyle >= 75) strengths.push('Sales style is aligned with consultative AI solution selling.');
  if (factorScores.whyChoose >= 70) strengths.push('Motivation statement is specific and commercially relevant.');

  if (factorScores.salesExperience < 50) weaknesses.push('Limited proven sales experience so far.');
  if (factorScores.hasSoldSaaS < 60) weaknesses.push('SaaS selling readiness still needs development.');
  if (factorScores.whyChoose < 55) weaknesses.push('Motivation statement is still too generic or lacks persuasive depth.');
  if (factorScores.currentOccupation < 55) weaknesses.push('Current role has limited direct alignment with affiliate selling.');

  let recommendation = 'qualified_candidate';
  let hiringSignal = 'medium';

  if (weightedScore >= 85) {
    recommendation = 'strong_candidate';
    hiringSignal = 'high';
  } else if (weightedScore < 80) {
    recommendation = weightedScore >= 70 ? 'borderline_candidate' : 'not_recommended';
    hiringSignal = weightedScore >= 70 ? 'medium' : 'low';
  }

  return {
    factorScores,
    overallScore: weightedScore,
    recommendation,
    hiringSignal,
    summary:
      weightedScore >= 80
        ? 'Candidate shows a credible base for affiliate sales and can progress to the next stage.'
        : 'Candidate needs stronger evidence of sales readiness before progressing confidently.',
    strengths: strengths.length ? strengths : ['Shows baseline interest in the role.'],
    weaknesses: weaknesses.length ? weaknesses : ['Requires deeper validation in later stages.'],
    decisionRationale:
      weightedScore >= 80
        ? 'Profile demonstrates enough role fit, motivation, and commercial readiness for next-step evaluation.'
        : 'Current evidence is not yet strong enough to justify confident advancement without higher risk.',
    weightRationale:
      'Sales experience, SaaS exposure, and the quality of the motivation statement were weighted most heavily because they best predict readiness for affiliate selling.',
    whyChooseAssessment:
      factorScores.whyChoose >= 70
        ? 'The motivation answer is detailed enough to support credibility and role fit.'
        : 'The motivation answer is still too generic, too short, or not persuasive enough for confident progression.',
  };
};

const analyzeWithAI = async (data) => {
  const client = getOpenAICompatibleClient();
  if (!client) return null;

  const userPrompt = JSON.stringify({
    currentOccupation: compactText(data.occupation, 120),
    salesExperience: compactText(data.salesExperience, 40),
    hasSoldSaaS: compactText(data.hasSoldSaaS, 16),
    salesStyle: compactText(data.salesStyle, 32),
    incomeGoal: compactText(data.incomeGoal, 24),
    whyChoose: compactText(data.whyChoose, 900),
  });

  const response = await client.chat.completions.create({
    model: getGeminiModel(),
    temperature: 0.2,
    max_tokens: 700,
    messages: [
      { role: 'system', content: SCREENING_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content || '';
  return safeJsonParse(content);
};

const normalizeAiAnalysis = (rawAnalysis, fallbackAnalysis) => {
  if (!rawAnalysis) return fallbackAnalysis;

  const factorScores = {
    currentOccupation: Number(rawAnalysis?.factorScores?.currentOccupation ?? fallbackAnalysis.factorScores.currentOccupation),
    salesExperience: Number(rawAnalysis?.factorScores?.salesExperience ?? fallbackAnalysis.factorScores.salesExperience),
    hasSoldSaaS: Number(rawAnalysis?.factorScores?.hasSoldSaaS ?? fallbackAnalysis.factorScores.hasSoldSaaS),
    salesStyle: Number(rawAnalysis?.factorScores?.salesStyle ?? fallbackAnalysis.factorScores.salesStyle),
    incomeGoal: Number(rawAnalysis?.factorScores?.incomeGoal ?? fallbackAnalysis.factorScores.incomeGoal),
    whyChoose: Number(rawAnalysis?.factorScores?.whyChoose ?? fallbackAnalysis.factorScores.whyChoose),
  };

  return {
    factorScores,
    overallScore: Number(rawAnalysis.overallScore ?? fallbackAnalysis.overallScore),
    recommendation: rawAnalysis.recommendation || fallbackAnalysis.recommendation,
    hiringSignal: rawAnalysis.hiringSignal || fallbackAnalysis.hiringSignal,
    summary: String(rawAnalysis.summary || fallbackAnalysis.summary),
    strengths: normalizeList(rawAnalysis.strengths, fallbackAnalysis.strengths),
    weaknesses: normalizeList(rawAnalysis.weaknesses, fallbackAnalysis.weaknesses),
    decisionRationale: String(rawAnalysis.decisionRationale || fallbackAnalysis.decisionRationale),
    weightRationale: String(rawAnalysis.weightRationale || fallbackAnalysis.weightRationale),
    whyChooseAssessment: String(rawAnalysis.whyChooseAssessment || fallbackAnalysis.whyChooseAssessment),
  };
};

export const analyzeApplicantWithAI = async (affiliateId) => {
  const affiliate = await db
    .select()
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  if (!affiliate || !affiliate[0]) {
    throw new Error('Affiliate not found');
  }

  const data = affiliate[0];
  const fallbackAnalysis = buildFallbackAnalysis(data);
  let finalAnalysis = fallbackAnalysis;
  let provider = 'fallback';

  if (getGeminiApiKey()) {
    try {
      const aiAnalysis = await analyzeWithAI(data);
      finalAnalysis = normalizeAiAnalysis(aiAnalysis, fallbackAnalysis);
      provider = 'gemini-openai-compatible';
    } catch (error) {
      logger.error('AI screening analysis failed, fallback analysis will be used:', error);
    }
  }

  return {
    totalScore: finalAnalysis.overallScore,
    maxScore: 100,
    percentage: finalAnalysis.overallScore,
    provider,
    breakdown: finalAnalysis.factorScores,
    summary: finalAnalysis.summary,
    strengths: finalAnalysis.strengths,
    weaknesses: finalAnalysis.weaknesses,
    recommendation: finalAnalysis.recommendation,
    hiringSignal: finalAnalysis.hiringSignal,
    decisionRationale: finalAnalysis.decisionRationale,
    weightRationale: finalAnalysis.weightRationale,
    whyChooseAssessment: finalAnalysis.whyChooseAssessment,
    analysisJson: finalAnalysis,
  };
};

const analyzeBatchWithAI = async (candidates) => {
  const client = getOpenAICompatibleClient();
  if (!client) return null;

  const compactCandidates = candidates.map(compactCandidateForBatch);

  const response = await client.chat.completions.create({
    model: getGeminiModel(),
    temperature: 0.2,
    max_tokens: 1100,
    messages: [
      { role: 'system', content: BATCH_SCREENING_SYSTEM_PROMPT },
      {
        role: 'user',
        content: JSON.stringify(compactCandidates),
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content || '';
  return safeJsonParse(content);
};

const buildFallbackBatchAnalysis = (candidates, fallbackPassingScore = 80) => {
  const sorted = [...candidates].sort((a, b) => b.overallScore - a.overallScore);
  const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
  const averageTopHalf =
    topHalf.reduce((sum, item) => sum + Number(item.overallScore || 0), 0) / Math.max(topHalf.length, 1);
  const passingThreshold = clampScore(Math.round((averageTopHalf + fallbackPassingScore) / 2), fallbackPassingScore);

  const candidateDecisions = sorted.map((candidate) => ({
    affiliateId: candidate.affiliateId,
    label: candidate.overallScore >= passingThreshold ? 'Qualified' : 'Unqualified',
    reason:
      candidate.overallScore >= passingThreshold
        ? 'Overall profile is strong enough compared with the rest of the batch.'
        : 'Overall profile is below the batch passing line for this round.',
  }));

  const qualifiedCount = candidateDecisions.filter((item) => item.label === 'Qualified').length;
  const unqualifiedCount = candidateDecisions.length - qualifiedCount;

  return {
    passingThreshold,
    summary: `The batch shows ${qualifiedCount} candidates ready to continue and ${unqualifiedCount} candidates who still need a stronger sales-readiness profile.`,
    decisionRationale:
      'The fallback threshold balances baseline screening expectations with the relative strength of the current batch.',
    qualifiedCount,
    unqualifiedCount,
    topSignals: [
      'Relevant sales background',
      'Clear SaaS familiarity',
      'Detailed and persuasive motivation statements',
    ],
    riskSignals: [
      'Generic or weak motivation statements',
      'Low SaaS exposure',
      'Limited evidence of consultative selling fit',
    ],
    candidateDecisions,
  };
};

const normalizeBatchAnalysis = (rawAnalysis, fallbackAnalysis, candidates) => {
  if (!rawAnalysis) return fallbackAnalysis;

  const validIds = new Set(candidates.map((candidate) => candidate.affiliateId));
  const decisions = Array.isArray(rawAnalysis.candidateDecisions)
    ? rawAnalysis.candidateDecisions
        .map((item) => ({
          affiliateId: String(item?.affiliateId || '').trim(),
          label: String(item?.label || '').trim() === 'Qualified' ? 'Qualified' : 'Unqualified',
          reason: String(item?.reason || '').trim(),
        }))
        .filter((item) => item.affiliateId && validIds.has(item.affiliateId))
    : [];

  const mergedDecisions = candidates.map((candidate) => {
    const matched = decisions.find((item) => item.affiliateId === candidate.affiliateId);
    return (
      matched || fallbackAnalysis.candidateDecisions.find((item) => item.affiliateId === candidate.affiliateId)
    );
  }).filter(Boolean);

  const qualifiedCount = mergedDecisions.filter((item) => item.label === 'Qualified').length;
  const unqualifiedCount = mergedDecisions.length - qualifiedCount;

  return {
    passingThreshold: clampScore(rawAnalysis.passingThreshold, fallbackAnalysis.passingThreshold),
    summary: String(rawAnalysis.summary || fallbackAnalysis.summary),
    decisionRationale: String(rawAnalysis.decisionRationale || fallbackAnalysis.decisionRationale),
    qualifiedCount,
    unqualifiedCount,
    topSignals: normalizeList(rawAnalysis.topSignals, fallbackAnalysis.topSignals),
    riskSignals: normalizeList(rawAnalysis.riskSignals, fallbackAnalysis.riskSignals),
    candidateDecisions: mergedDecisions,
  };
};

export const analyzeBatchScreeningWithAI = async (candidates, fallbackPassingScore = 80) => {
  const fallbackAnalysis = buildFallbackBatchAnalysis(candidates, fallbackPassingScore);

  if (!getGeminiApiKey()) {
    return {
      ...fallbackAnalysis,
      provider: 'fallback',
    };
  }

  try {
    const aiAnalysis = await analyzeBatchWithAI(candidates);
    return {
      ...normalizeBatchAnalysis(aiAnalysis, fallbackAnalysis, candidates),
      provider: 'gemini-openai-compatible',
    };
  } catch (error) {
    logger.error('AI batch screening analysis failed, fallback batch analysis will be used:', error);
    return {
      ...fallbackAnalysis,
      provider: 'fallback',
    };
  }
};

export const saveScreeningScore = async (affiliateId, score) => {
  const examToken = uuidv4();
  const settings = await getAssessmentSettings();
  const passingScore = Number(settings?.screeningPassingScore || 80);
  const maxExamAttempts = Number(settings?.maxExamAttempts || 2);
  const examPassingScore = await getExamPassingScoreForAffiliate(affiliateId);

  let session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.affiliateId, affiliateId))
    .limit(1);

  if (session && session[0]) {
    await db
      .update(assessmentSession)
      .set({
        reviewerNotes: score.summary,
        examToken: session[0].examToken || examToken,
        tokenInvalidated: false,
        status: 'not_started',
        startedAt: null,
        submittedAt: null,
        scoredAt: null,
        totalDurationSeconds: null,
        totalScore: 0,
        maxScore: 0,
        percentage: 0,
        isPassed: null,
        expiresAt: null,
        passingPercentage: examPassingScore,
        trainingStatus: 'not_started',
        trainingCompletedAt: null,
        trainingEmbedViewed: false,
        trainingVideoCompleted: false,
        trainingPdfPagesViewed: null,
        trainingAgreementAccepted: false,
        examMustCompleteBy: null,
        maxExamAttempts,
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, session[0].id));

    return {
      id: session[0].id,
      examToken: session[0].examToken || examToken,
      expiresAt: null,
      screeningPassingScore: passingScore,
      interviewStatus: session[0].interviewStatus || 'not_started',
      interviewSubmittedLink: session[0].interviewSubmittedLink || null,
      interviewSubmittedAt: session[0].interviewSubmittedAt || null,
      interviewInvitationSentAt: session[0].interviewInvitationSentAt || null,
      trainingInvitationSentAt: session[0].trainingInvitationSentAt || null,
    };
  }

  const [newSession] = await db
    .insert(assessmentSession)
    .values({
      affiliateId,
      status: 'not_started',
      interviewStatus: 'not_started',
      examToken,
      expiresAt: null,
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      passingPercentage: examPassingScore,
      isPassed: null,
      reviewerNotes: score.summary,
      trainingStatus: 'not_started',
      maxExamAttempts,
    })
    .$returningId();

  return {
    id: newSession,
    examToken,
    expiresAt: null,
    screeningPassingScore: passingScore,
    interviewStatus: 'not_started',
    interviewSubmittedLink: null,
    interviewSubmittedAt: null,
    interviewInvitationSentAt: null,
    trainingInvitationSentAt: null,
  };
};
