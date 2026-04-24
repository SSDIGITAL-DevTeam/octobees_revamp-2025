import OpenAI from 'openai';
import { db } from '../../drizzle/db.js';
import { affiliateApplication, assessmentAnswer, assessmentQuestion, assessmentSession } from '../../drizzle/schema.js';
import { and, asc, eq, inArray } from 'drizzle-orm';
import logger from '../../utils/logger.js';

const getGeminiApiKey = () => process.env.GEMINI_API_KEY;
const getGeminiModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const getGeminiBaseUrl = () =>
  process.env.GEMINI_OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/';

const EXAM_EVALUATION_SYSTEM_PROMPT = `
Evaluate an affiliate-sales exam result using objective correctness and written reasoning quality.
Return STRICT JSON only:
{
  "overallScore": number,
  "recommendation": "strong_candidate" | "qualified_candidate" | "borderline_candidate" | "not_recommended",
  "hiringSignal": "high" | "medium" | "low",
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "decisionRationale": string,
  "phaseBreakdown": {
    "objectiveAccuracy": number,
    "salesReasoning": number,
    "communicationClarity": number,
    "productUnderstanding": number
  }
}
Scores are 0-100. strengths/weaknesses: 2-4 concise items. Be strict and concise.
`.trim();

const ESSAY_AUTO_SCORING_SYSTEM_PROMPT = `
Score each essay answer against its question. Judge relevance, completeness, commercial reasoning, specificity, clarity, and product understanding.
Be strict. Generic or vague answers should score low.
Return STRICT JSON only:
{
  "answers": [
    {
      "questionId": string,
      "score": number,
      "feedback": string
    }
  ]
}
`.trim();

const FINAL_COMPILATION_SYSTEM_PROMPT = `
Synthesize initial screening, exam evaluation, and official exam metadata into one hiring recommendation.
Return STRICT JSON only:
{
  "recommendation": "strong_candidate" | "qualified_candidate" | "borderline_candidate" | "not_recommended",
  "hiringSignal": "high" | "medium" | "low",
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "decisionRationale": string,
  "phaseSummary": {
    "initialScreening": string,
    "examPhase": string,
    "combinedView": string,
    "examAttempts": string
  }
}
Keep summary and rationale concise and decision-oriented. This is a recommendation, not an approval.
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

const clampScore = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
};

const clampPoints = (value, maxScore, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return Math.max(0, Math.min(maxScore, fallback));
  return Math.max(0, Math.min(maxScore, Math.round(parsed)));
};

const compactText = (value, maxLength = 320) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
};

const buildFallbackEssayScore = ({ question, answer, maxScore }) => {
  const normalizedAnswer = String(answer || '').trim();
  const words = normalizedAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const questionKeywords = String(question || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 5);

  const normalizedAnswerLower = normalizedAnswer.toLowerCase();
  const keywordHits = questionKeywords.filter((keyword) =>
    normalizedAnswerLower.includes(keyword)
  ).length;

  const salesSignalHits = [
    'lead',
    'qualification',
    'crm',
    'automation',
    'follow-up',
    'follow up',
    'sales',
    'prospect',
    'pipeline',
    'pain point',
    'workflow',
    'response time',
    'conversion',
  ].filter((signal) => normalizedAnswerLower.includes(signal)).length;

  const baseRatio = Math.min(0.45, wordCount / 120);
  const keywordRatio = questionKeywords.length
    ? Math.min(0.25, keywordHits / questionKeywords.length)
    : 0.1;
  const signalRatio = Math.min(0.2, salesSignalHits * 0.03);
  const structureRatio = /[,.;:]/.test(normalizedAnswer) ? 0.1 : 0.03;

  const ratio = Math.max(0, Math.min(1, baseRatio + keywordRatio + signalRatio + structureRatio));
  const score = clampPoints(Math.round(maxScore * ratio), maxScore, 0);

  const feedback =
    score >= maxScore * 0.7
      ? 'Answer is relevant and shows usable commercial reasoning, but can still be more specific.'
      : score >= maxScore * 0.4
        ? 'Answer shows partial understanding, but remains too general and lacks enough concrete qualification steps.'
        : 'Answer is too brief or generic, and does not give enough specific sales qualification logic for this question.';

  return { score, feedback };
};

const buildFallbackExamAnalysis = ({ session, questions, answers }) => {
  const totalQuestions = questions.length || 1;
  const answeredQuestions = answers.length;
  const mcQuestions = questions.filter((question) => question.questionType === 'multiple_choice');
  const essayQuestions = questions.filter((question) => question.questionType === 'essay');

  const correctCount = answers.filter((answer) => answer.answerType === 'multiple_choice' && answer.isCorrect).length;
  const objectiveAccuracy = mcQuestions.length
    ? Math.round((correctCount / mcQuestions.length) * 100)
    : clampScore(session.percentage || 0);

  const essayLengths = answers
    .filter((answer) => answer.answerType === 'essay')
    .map((answer) => String(answer.essayAnswer || '').trim().split(/\s+/).filter(Boolean).length);
  const averageEssayWords = essayLengths.length
    ? essayLengths.reduce((sum, count) => sum + count, 0) / essayLengths.length
    : 0;

  const communicationClarity = clampScore(Math.min(100, 35 + averageEssayWords * 1.4), 45);
  const salesReasoning = clampScore(Math.round((objectiveAccuracy * 0.45) + (communicationClarity * 0.55)), 50);
  const productUnderstanding = clampScore(Math.round((objectiveAccuracy * 0.65) + (communicationClarity * 0.35)), 50);
  const overallScore = clampScore(
    Math.round(
      objectiveAccuracy * 0.35 +
        salesReasoning * 0.25 +
        communicationClarity * 0.2 +
        productUnderstanding * 0.2
    ),
    50
  );

  let recommendation = 'qualified_candidate';
  let hiringSignal = 'medium';

  if (overallScore >= 85) {
    recommendation = 'strong_candidate';
    hiringSignal = 'high';
  } else if (overallScore < 75) {
    recommendation = overallScore >= 65 ? 'borderline_candidate' : 'not_recommended';
    hiringSignal = overallScore >= 65 ? 'medium' : 'low';
  }

  const strengths = [];
  const weaknesses = [];

  if (objectiveAccuracy >= 75) strengths.push('Shows strong objective accuracy across the assessment.');
  if (communicationClarity >= 70) strengths.push('Written responses are reasonably clear and structured.');
  if (productUnderstanding >= 72) strengths.push('Demonstrates usable understanding of the product or solution context.');

  if (objectiveAccuracy < 60) weaknesses.push('Objective accuracy is still below the preferred threshold.');
  if (communicationClarity < 60) weaknesses.push('Written answers need stronger clarity, depth, or structure.');
  if (salesReasoning < 65) weaknesses.push('Commercial reasoning still needs closer validation.');

  return {
    overallScore,
    recommendation,
    hiringSignal,
    summary:
      overallScore >= 75
        ? 'Exam performance indicates workable commercial readiness, with enough evidence to support continued review.'
        : 'Exam performance still leaves material concerns around readiness and should be reviewed cautiously.',
    strengths: strengths.length ? strengths : ['Completed the exam and provided enough data for review.'],
    weaknesses: weaknesses.length ? weaknesses : ['Requires additional validation in manual review.'],
    decisionRationale:
      overallScore >= 75
        ? 'The candidate demonstrated enough answer quality and assessment accuracy to support forward consideration, subject to admin review.'
        : 'The candidate did not yet demonstrate consistently strong exam performance for a confident recommendation.',
    phaseBreakdown: {
      objectiveAccuracy,
      salesReasoning,
      communicationClarity,
      productUnderstanding,
    },
    metadata: {
      totalQuestions,
      answeredQuestions,
      mcQuestions: mcQuestions.length,
      essayQuestions: essayQuestions.length,
    },
  };
};

const buildFallbackFinalCompilation = ({ screening, exam, session }) => {
  const screeningScore = clampScore(screening?.overallScore ?? screening?.totalScore ?? 0);
  const examScore = clampScore(exam?.overallScore ?? session?.percentage ?? 0);
  const examAttemptCount = Math.max(1, Number(session?.examAttemptCount || 1));
  const maxExamAttempts = Math.max(1, Number(session?.maxExamAttempts || 2));
  const attemptPenalty = examAttemptCount <= 1 ? 0 : examAttemptCount === 2 ? 6 : 12;
  const combinedScore = clampScore(
    Math.round(screeningScore * 0.4 + examScore * 0.6 - attemptPenalty),
    50
  );

  let recommendation = 'qualified_candidate';
  let hiringSignal = 'medium';

  if (combinedScore >= 85) {
    recommendation = 'strong_candidate';
    hiringSignal = 'high';
  } else if (combinedScore < 75) {
    recommendation = combinedScore >= 65 ? 'borderline_candidate' : 'not_recommended';
    hiringSignal = combinedScore >= 65 ? 'medium' : 'low';
  }

  const strengths = normalizeList(
    [...(screening?.strengths || []), ...(exam?.strengths || [])],
    ['Shows baseline candidate potential across both phases.']
  ).slice(0, 4);

  const weaknesses = normalizeList(
    [...(screening?.weaknesses || []), ...(exam?.weaknesses || [])],
    ['Still requires further manual validation.']
  ).slice(0, 4);

  if (examAttemptCount <= 1) {
    strengths.unshift('Reached the current exam outcome on the first attempt, which supports readiness and retention.');
  } else if (examAttemptCount === 2) {
    weaknesses.unshift('Needed one retry before reaching the current exam outcome, so consistency should still be reviewed.');
  } else {
    weaknesses.unshift('Needed multiple exam attempts, which lowers confidence in immediate readiness.');
  }

  const examAttemptsSummary =
    examAttemptCount <= 1
      ? 'The candidate reached the current certification outcome on the first attempt.'
      : examAttemptCount === 2
        ? 'The candidate needed a second attempt to reach the current certification outcome.'
        : `The candidate needed ${examAttemptCount} attempts out of a maximum of ${maxExamAttempts}, which should be treated as a meaningful performance signal.`;

  return {
    recommendation,
    hiringSignal,
    summary:
      combinedScore >= 75
        ? 'Across screening and exam phases, the candidate presents a credible basis for continued consideration and final admin review.'
        : 'The combined evidence from screening and exam still indicates elevated hiring risk and should be treated cautiously.',
    strengths,
    weaknesses,
    decisionRationale:
      combinedScore >= 75
        ? 'The candidate maintained enough consistency between initial screening readiness and exam performance to justify positive review momentum.'
        : 'The candidate did not maintain a sufficiently strong profile across both phases for a confident hiring recommendation.',
    phaseSummary: {
      initialScreening: screening?.summary || 'Initial screening summary unavailable.',
      examPhase: exam?.summary || 'Exam phase summary unavailable.',
      combinedView:
        combinedScore >= 75
          ? 'The overall profile remains commercially credible when both phases are considered together.'
          : 'The combined profile still has notable gaps when both phases are reviewed together.',
      examAttempts: examAttemptsSummary,
    },
  };
};

const analyzeWithAI = async (systemPrompt, payload) => {
  const client = getOpenAICompatibleClient();
  if (!client) return null;

  const response = await client.chat.completions.create({
    model: getGeminiModel(),
    temperature: 0.2,
    max_tokens: 900,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(payload) },
    ],
  });

  const content = response.choices?.[0]?.message?.content || '';
  return safeJsonParse(content);
};

export const evaluateExamPhaseWithAI = async (sessionId) => {
  const [session] = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session) {
    throw new Error('Assessment session not found');
  }

  const answers = await db
    .select({
      id: assessmentAnswer.id,
      questionId: assessmentAnswer.questionId,
      answerType: assessmentAnswer.answerType,
      selectedOption: assessmentAnswer.selectedOption,
      essayAnswer: assessmentAnswer.essayAnswer,
      videoUrl: assessmentAnswer.videoUrl,
      score: assessmentAnswer.score,
      reviewerScore: assessmentAnswer.reviewerScore,
      isCorrect: assessmentAnswer.isCorrect,
      maxScore: assessmentAnswer.maxScore,
      question: assessmentQuestion.question,
      correctAnswer: assessmentQuestion.correctAnswer,
      points: assessmentQuestion.points,
      orderIndex: assessmentQuestion.orderIndex,
      questionType: assessmentQuestion.questionType,
    })
    .from(assessmentAnswer)
    .innerJoin(assessmentQuestion, eq(assessmentQuestion.id, assessmentAnswer.questionId))
    .where(eq(assessmentAnswer.sessionId, sessionId))
    .orderBy(asc(assessmentQuestion.orderIndex));

  const questionIds = answers.map((answer) => answer.questionId);
  const questions = questionIds.length
    ? await db
        .select()
        .from(assessmentQuestion)
        .where(inArray(assessmentQuestion.id, questionIds))
    : [];

  const fallback = buildFallbackExamAnalysis({ session, questions, answers });
  let finalAnalysis = fallback;
  let provider = 'fallback';

  if (getGeminiApiKey()) {
    try {
      const aiAnalysis = await analyzeWithAI(EXAM_EVALUATION_SYSTEM_PROMPT, {
        examMeta: {
          officialPercentage: session.percentage,
          totalScore: session.totalScore,
          maxScore: session.maxScore,
          status: session.status,
        },
        answers: answers.map((answer) => ({
          question: compactText(answer.question, 220),
          type: answer.questionType,
          candidateAnswer:
            answer.answerType === 'multiple_choice'
              ? answer.selectedOption
              : answer.answerType === 'essay'
                ? compactText(answer.essayAnswer, 500)
                : answer.videoUrl,
          correctAnswer:
            answer.answerType === 'multiple_choice' ? answer.correctAnswer : null,
          isCorrect:
            answer.answerType === 'multiple_choice' ? Boolean(answer.isCorrect) : null,
          points: answer.points,
          score:
            answer.answerType === 'multiple_choice'
              ? answer.score
              : answer.reviewerScore ?? answer.score,
        })),
      });

      finalAnalysis = {
        overallScore: clampScore(aiAnalysis?.overallScore, fallback.overallScore),
        recommendation: aiAnalysis?.recommendation || fallback.recommendation,
        hiringSignal: aiAnalysis?.hiringSignal || fallback.hiringSignal,
        summary: String(aiAnalysis?.summary || fallback.summary),
        strengths: normalizeList(aiAnalysis?.strengths, fallback.strengths),
        weaknesses: normalizeList(aiAnalysis?.weaknesses, fallback.weaknesses),
        decisionRationale: String(aiAnalysis?.decisionRationale || fallback.decisionRationale),
        phaseBreakdown: {
          objectiveAccuracy: clampScore(aiAnalysis?.phaseBreakdown?.objectiveAccuracy, fallback.phaseBreakdown.objectiveAccuracy),
          salesReasoning: clampScore(aiAnalysis?.phaseBreakdown?.salesReasoning, fallback.phaseBreakdown.salesReasoning),
          communicationClarity: clampScore(aiAnalysis?.phaseBreakdown?.communicationClarity, fallback.phaseBreakdown.communicationClarity),
          productUnderstanding: clampScore(aiAnalysis?.phaseBreakdown?.productUnderstanding, fallback.phaseBreakdown.productUnderstanding),
        },
      };
      provider = 'gemini-openai-compatible';
    } catch (error) {
      logger.error('Exam AI evaluation failed, fallback analysis will be used:', error);
    }
  }

  return {
    provider,
    ...finalAnalysis,
    analysisJson: finalAnalysis,
  };
};

export const autoScoreEssayAnswers = async (essayAnswers = []) => {
  if (!Array.isArray(essayAnswers) || essayAnswers.length === 0) {
    return [];
  }

  const fallbackScores = essayAnswers.map((item) => {
    const fallback = buildFallbackEssayScore({
      question: item.question,
      answer: item.essayAnswer,
      maxScore: item.maxScore,
    });

    return {
      questionId: item.questionId,
      score: fallback.score,
      feedback: fallback.feedback,
    };
  });

  if (!getGeminiApiKey()) {
    return fallbackScores;
  }

  try {
    const aiAnalysis = await analyzeWithAI(ESSAY_AUTO_SCORING_SYSTEM_PROMPT, {
      answers: essayAnswers.map((item) => ({
        questionId: item.questionId,
        question: compactText(item.question, 240),
        candidateAnswer: compactText(item.essayAnswer, 550),
        maxScore: item.maxScore,
      })),
    });

    const aiAnswers = Array.isArray(aiAnalysis?.answers) ? aiAnalysis.answers : [];
    const aiAnswerMap = new Map(aiAnswers.map((item) => [item.questionId, item]));

    return essayAnswers.map((item, index) => {
      const aiItem = aiAnswerMap.get(item.questionId);
      const fallback = fallbackScores[index];

      return {
        questionId: item.questionId,
        score: clampPoints(aiItem?.score, item.maxScore, fallback.score),
        feedback: String(aiItem?.feedback || fallback.feedback),
      };
    });
  } catch (error) {
    logger.error('Essay auto-scoring failed, fallback scoring will be used:', error);
    return fallbackScores;
  }
};

export const compileFinalAssessmentDecision = async (affiliateId, examAnalysis, session) => {
  const [affiliate] = await db
    .select()
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  if (!affiliate) {
    throw new Error('Affiliate application not found');
  }

  const screeningAnalysis = safeJsonParse(affiliate.screeningAnalysisJson) || {
    overallScore: affiliate.screeningScore || 0,
    recommendation: affiliate.screeningRecommendation,
    summary: affiliate.screeningSummary,
    strengths: safeJsonParse(affiliate.screeningStrengths) || [],
    weaknesses: safeJsonParse(affiliate.screeningWeaknesses) || [],
  };

  const fallback = buildFallbackFinalCompilation({
    screening: screeningAnalysis,
    exam: examAnalysis,
    session,
  });

  let finalAnalysis = fallback;
  let provider = 'fallback';

  if (getGeminiApiKey()) {
    try {
      const aiAnalysis = await analyzeWithAI(FINAL_COMPILATION_SYSTEM_PROMPT, {
        candidate: {
          fullName: affiliate.fullName,
          email: affiliate.email,
          currentOccupation: affiliate.occupation,
          salesExperience: affiliate.salesExperience,
          hasSoldSaaS: affiliate.hasSoldSaaS,
          salesStyle: affiliate.salesStyle,
          incomeGoal: affiliate.incomeGoal,
        },
        initialScreening: screeningAnalysis,
        examPhase: {
          officialPercentage: session?.percentage,
          officialTotalScore: session?.totalScore,
          officialMaxScore: session?.maxScore,
          examAttemptCount: session?.examAttemptCount,
          maxExamAttempts: session?.maxExamAttempts,
          aiExamAnalysis: examAnalysis,
        },
      });

      finalAnalysis = {
        recommendation: aiAnalysis?.recommendation || fallback.recommendation,
        hiringSignal: aiAnalysis?.hiringSignal || fallback.hiringSignal,
        summary: String(aiAnalysis?.summary || fallback.summary),
        strengths: normalizeList(aiAnalysis?.strengths, fallback.strengths),
        weaknesses: normalizeList(aiAnalysis?.weaknesses, fallback.weaknesses),
        decisionRationale: String(aiAnalysis?.decisionRationale || fallback.decisionRationale),
        phaseSummary: {
          initialScreening: String(aiAnalysis?.phaseSummary?.initialScreening || fallback.phaseSummary.initialScreening),
          examPhase: String(aiAnalysis?.phaseSummary?.examPhase || fallback.phaseSummary.examPhase),
          combinedView: String(aiAnalysis?.phaseSummary?.combinedView || fallback.phaseSummary.combinedView),
          examAttempts: String(aiAnalysis?.phaseSummary?.examAttempts || fallback.phaseSummary.examAttempts),
        },
      };
      provider = 'gemini-openai-compatible';
    } catch (error) {
      logger.error('Final HRD AI compilation failed, fallback analysis will be used:', error);
    }
  }

  return {
    provider,
    ...finalAnalysis,
    analysisJson: finalAnalysis,
  };
};
