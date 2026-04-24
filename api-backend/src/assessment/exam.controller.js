import express from 'express';
import {
  validateExamToken,
  getExamQuestions,
  submitExam,
  getExamResult,
  queueBatchScreening,
  saveAnswers,
  getSavedAnswers,
  getPublicVideoInstructions,
  getInterviewContent,
  submitInterview,
  retryExamFromTraining,
} from './exam.service.js';
import logger from '../../utils/logger.js';
import { extractClientIp } from './exam-security.service.js';
import { subscribeExamResult } from './exam-result-events.js';
import { ensureBatchAiSummaryColumnsAvailable } from '../affiliate-batch/batch-ai-columns.js';

const router = express.Router();

// Public generic video instructions endpoint
router.get('/public/video-instructions', async (req, res) => {
  try {
    const questions = await getPublicVideoInstructions();
    res.json({ status: 'success', data: questions });
  } catch (error) {
    logger.error({ err: error }, 'Get public video instructions error');
    res.status(400).json({ error: error.message });
  }
});

const runBatchScreening = async (req, res) => {
  try {
    await ensureBatchAiSummaryColumnsAvailable();
    const batchIds = Array.isArray(req.body?.batchIds)
      ? req.body.batchIds.filter(Boolean)
      : req.body?.batchId
        ? [req.body.batchId]
        : undefined;
    const queued = await queueBatchScreening({
      batchIds,
      source: 'manual_back_office_trigger',
    });
    const alreadyRunning = queued.status === 'already_running';
    res.json({
      status: 'success',
      data: {
        ...queued,
        message: alreadyRunning
          ? 'AI curation is already running for this batch.'
          : 'AI curation has been queued and will continue in the background.',
      },
    });
  } catch (error) {
    logger.error({ err: error, body: req.body }, 'Batch screening error');
    const statusCode =
      error.code === 'BATCH_AI_SUMMARY_MIGRATION_REQUIRED' ? 409 : 500;
    res.status(statusCode).json({ error: error.message, code: error.code });
  }
};

router.get('/validate/:token', async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Validating token:', token);
    const session = await validateExamToken(token);
    console.log('Session found:', session);
    res.json({ status: 'success', data: session });
  } catch (error) {
    console.error('Validate error:', error);
    logger.error({ err: error }, 'Validate token error');
    res.status(400).json({ error: error.message || error.toString() });
  }
});

router.get('/questions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const questions = await getExamQuestions(sessionId);
    res.json({ status: 'success', data: questions });
  } catch (error) {
    logger.error({ err: error }, 'Get questions error');
    res.status(400).json({ error: error.message });
  }
});

router.post('/submit/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers, fingerprint, tabSwitchCount, isFullscreen } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const ipAddress = extractClientIp(req);
    const userAgent = req.get('User-Agent') || null;

    const result = await submitExam(sessionId, answers, ipAddress, userAgent, {
      fingerprint,
      tabSwitchCount,
      isFullscreen,
    });
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Submit exam error');
    res.status(400).json({ error: error.message });
  }
});

router.post('/retry/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await retryExamFromTraining(sessionId);
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Retry exam error');
    res.status(400).json({ error: error.message });
  }
});

router.get('/result/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await getExamResult(sessionId);
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Get result error');
    res.status(400).json({ error: error.message });
  }
});

router.get('/result-stream/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (payload) => {
    res.write(`data: ${payload}\n\n`);
  };

  try {
    const initial = await getExamResult(sessionId);
    sendEvent(JSON.stringify({
      type: 'exam_result_snapshot',
      result: initial,
    }));
  } catch (error) {
    sendEvent(JSON.stringify({
      type: 'exam_result_error',
      message: error.message,
    }));
  }

  const unsubscribe = subscribeExamResult(sessionId, sendEvent);
  const heartbeat = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  });
});

router.post('/save/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const result = await saveAnswers(sessionId, answers);
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Save answers error');
    res.status(400).json({ error: error.message });
  }
});

router.get('/answers/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const answers = await getSavedAnswers(sessionId);
    res.json({ status: 'success', data: answers });
  } catch (error) {
    logger.error({ err: error, sessionId }, 'Get answers error');
    res.status(400).json({ error: error.message });
  }
});

router.post('/start/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const ipAddress = extractClientIp(req);
    const userAgent = req.get('User-Agent') || null;
    const { fingerprint } = req.body || {};

    const { startExam } = await import('./exam.service.js');
    const result = await startExam(sessionId, ipAddress, userAgent, { fingerprint });
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Start exam error');
    res.status(400).json({ error: error.message });
  }
});

router.get('/interview/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const data = await getInterviewContent(token);
    res.json({ status: 'success', data });
  } catch (error) {
    logger.error({ err: error }, 'Get interview error');
    res.status(400).json({ error: error.message });
  }
});

router.post('/interview/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { videoUrl } = req.body || {};
    const data = await submitInterview(token, videoUrl);
    res.json({ status: 'success', data });
  } catch (error) {
    logger.error({ err: error }, 'Submit interview error');
    res.status(400).json({ error: error.message });
  }
});

// Get training content
router.get('/training/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { getTrainingContent, validateTrainingToken } = await import('./exam.service.js');
    
    const session = await validateTrainingToken(token);
    
    if (!session) {
      throw new Error('Invalid training token');
    }
    
    // Check if training already completed
    const content = await getTrainingContent(session.id);
    const pdfPagesViewed = session.trainingPdfPagesViewed ? JSON.parse(session.trainingPdfPagesViewed) : [];
    const currentPdfPage = pdfPagesViewed.length > 0 ? Math.max(...pdfPagesViewed) : 1;
    
    res.json({ 
      status: 'success', 
      data: {
        ...content,
        affiliate: session.affiliate,
        interviewStatus: session.interviewStatus,
        interviewSubmittedAt: session.interviewSubmittedAt,
        trainingStatus: session.trainingStatus,
        trainingCompletedAt: session.trainingCompletedAt,
        trainingEmbedViewed: session.trainingEmbedViewed,
        trainingVideoCompleted: session.trainingVideoCompleted,
        trainingVideoCompletedIds: session.trainingVideoCompletedIds || [],
        pdfPagesViewed,
        currentPdfPage,
        trainingCredentialsViewed: session.trainingCredentialsViewed,
        trainingAgreementAccepted: session.trainingAgreementAccepted,
        examMustCompleteBy: session.examMustCompleteBy,
        sessionId: session.id,
      }
    });
  } catch (error) {
    logger.error({ err: error }, 'Get training error');
    res.status(400).json({ error: error.message });
  }
});

// Update training progress
router.post('/training/:sessionId/progress', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { 
      embedViewed, 
      videoCompleted, 
      videoCompletedIds,
      pdfPagesViewed, 
      pdfTotalPages,
      credentialsViewed,
      agreementAccepted,
      trainingCompleted,
    } = req.body;
    
    const { updateTrainingProgress } = await import('./exam.service.js');
    
    const result = await updateTrainingProgress(sessionId, {
      embedViewed,
      videoCompleted,
      videoCompletedIds,
      pdfPagesViewed,
      pdfTotalPages,
      credentialsViewed,
      agreementAccepted,
      trainingCompleted,
    });
    
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Update training progress error');
    res.status(400).json({ error: error.message });
  }
});

// Real-time cheat logging
router.post('/cheat-log/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { eventType, eventData } = req.body;
    
    if (!eventType) {
      throw new Error('eventType is required');
    }

    const ipAddress = extractClientIp(req);
    const userAgent = req.get('User-Agent') || null;
    
    const { logCheatAttempt } = await import('./exam.service.js');
    const result = await logCheatAttempt(sessionId, eventType, eventData, ipAddress, userAgent);
    
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error({ err: error }, 'Cheat log error');
    res.status(400).json({ error: error.message });
  }
});

export default router;
export { runBatchScreening };
