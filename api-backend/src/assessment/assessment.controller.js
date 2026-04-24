import express from 'express';
import {
  createQuestion,
  listQuestions,
  getQuestion,
  editQuestion,
  removeQuestion,
  reorderQuestions,
  startAssessment,
  getSession,
  getSessionByAffiliate,
  listSessions,
  removeSessionSubmission,
  resetSessionSubmission,
  submitAssessment,
  scoreAssessment,
  saveRegistrationData,
  getRegistrationData,
  getAssessmentForUser,
  submitAnswer,
  getAssessmentSettings,
  updateAssessmentSettings,
  regenerateAiReview
} from './assessment.service.js';
import logger from '../../utils/logger.js';
import { queueBackgroundTask } from '../utils/background-task.js';

const router = express.Router();

// =====================
// ASSESSMENT SETTINGS
// =====================
router.get('/settings', async (req, res) => {
  try {
    const settings = await getAssessmentSettings();
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json({ status: 'success', data: settings });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings/:id', async (req, res) => {
  try {
    const updated = await updateAssessmentSettings(req.params.id, req.body);
    res.json({ status: 'success', data: updated });
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(400).json({ error: error.message });
  }
});


// Middleware to extract affiliate ID from body/query
const extractAffiliateId = (req, res, next) => {
  const affiliateId = req.body.affiliateId || req.query.affiliateId || req.headers['x-affiliate-id'];
  if (!affiliateId) {
    return res.status(400).json({ error: 'Affiliate ID is required' });
  }
  req.affiliateId = affiliateId;
  next();
};

// =====================
// QUESTION MANAGEMENT (Admin)
// =====================

router.post('/questions', async (req, res) => {
  try {
    const question = await createQuestion(req.body);
    res.status(201).json({ status: 'success', data: question });
  } catch (error) {
    logger.error('Create question error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/questions', async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const questions = await listQuestions({
      type,
      isActive: isActive !== 'false',
    });
    res.json({ status: 'success', data: questions });
  } catch (error) {
    logger.error('List questions error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/questions/:id', async (req, res) => {
  try {
    const question = await getQuestion(req.params.id);
    res.json({ status: 'success', data: question });
  } catch (error) {
    logger.error('Get question error:', error);
    res.status(404).json({ error: error.message });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const question = await editQuestion(req.params.id, req.body);
    res.json({ status: 'success', data: question });
  } catch (error) {
    logger.error('Update question error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    await removeQuestion(req.params.id);
    res.json({ status: 'success', message: 'Question deleted' });
  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/questions/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, orderIndex }
    await reorderQuestions(orders);
    res.json({ status: 'success', message: 'Questions reordered' });
  } catch (error) {
    logger.error('Reorder questions error:', error);
    res.status(400).json({ error: error.message });
  }
});

// =====================
// SESSION MANAGEMENT (Admin)
// =====================

router.get('/sessions', async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await listSessions({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });
    res.json({ status: 'success', ...result });
  } catch (error) {
    logger.error('List sessions error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    res.json({ status: 'success', data: session });
  } catch (error) {
    logger.error('Get session error:', error);
    res.status(404).json({ error: error.message });
  }
});

router.delete('/sessions/:id', async (req, res) => {
  try {
    await removeSessionSubmission(req.params.id);
    res.json({ status: 'success', message: 'Submission deleted successfully' });
  } catch (error) {
    logger.error('Delete session error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/sessions/:id/reset', async (req, res) => {
  try {
    const session = await resetSessionSubmission(req.params.id);
    res.json({ status: 'success', data: session, message: 'Submission reset successfully' });
  } catch (error) {
    logger.error('Reset session error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Submit assessment (user endpoint)
router.post('/sessions/:id/submit', async (req, res) => {
  try {
    const session = await submitAssessment(req.params.id);
    res.json({ status: 'success', data: session });
  } catch (error) {
    logger.error('Submit assessment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Score assessment (admin endpoint)
router.post('/sessions/:id/score', async (req, res) => {
  try {
    const { scores, reviewerId, reviewerNotes } = req.body;
    
    // Get admin user ID from auth (assuming it's in the request)
    const adminId = req.headers['x-admin-id'] || reviewerId;
    
    if (!adminId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }
    
    const session = await scoreAssessment(req.params.id, scores, adminId, reviewerNotes);
    res.json({ status: 'success', data: session });
  } catch (error) {
    logger.error('Score assessment error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/ai-review/:affiliateId/regenerate', async (req, res) => {
  try {
    const { phase } = req.body || {};
    const queued = await queueBackgroundTask(
      'regenerate-ai-review',
      async () => {
        await regenerateAiReview(req.params.affiliateId, phase);
      },
      {
        affiliateId: req.params.affiliateId,
        phase: phase || 'all',
      },
    );
    res.json({
      status: 'success',
      data: {
        ...queued,
        message: 'AI review regeneration has been queued and will continue in the background.',
      },
    });
  } catch (error) {
    logger.error('Regenerate AI review error:', error);
    res.status(400).json({ error: error.message });
  }
});

// =====================
// USER ENDPOINTS (Partner/Applicant)
// =====================

// Start or get assessment for user
router.get('/my/assessment', extractAffiliateId, async (req, res) => {
  try {
    const assessment = await getAssessmentForUser(req.affiliateId);
    res.json({ status: 'success', data: assessment });
  } catch (error) {
    logger.error('Get user assessment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Submit individual answer
router.post('/my/assessment/answer', extractAffiliateId, async (req, res) => {
  try {
    const { questionId, ...answerData } = req.body;
    
    if (!questionId) {
      return res.status(400).json({ error: 'Question ID is required' });
    }
    
    await submitAnswer(req.affiliateId, questionId, answerData);
    res.json({ status: 'success', message: 'Answer saved' });
  } catch (error) {
    logger.error('Submit answer error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Submit all answers and complete assessment
router.post('/my/assessment/complete', extractAffiliateId, async (req, res) => {
  try {
    const session = await getSessionByAffiliate(req.affiliateId);
    
    if (!session) {
      return res.status(400).json({ error: 'No assessment session found' });
    }
    
    const result = await submitAssessment(session.id);
    res.json({ status: 'success', data: result });
  } catch (error) {
    logger.error('Complete assessment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// =====================
// REGISTRATION DATA
// =====================

// Save registration data
router.post('/registration', extractAffiliateId, async (req, res) => {
  try {
    const data = await saveRegistrationData(req.affiliateId, req.body);
    res.json({ status: 'success', data });
  } catch (error) {
    logger.error('Save registration data error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get registration data
router.get('/registration/:affiliateId', async (req, res) => {
  try {
    const data = await getRegistrationData(req.params.affiliateId);
    res.json({ status: 'success', data });
  } catch (error) {
    logger.error('Get registration data error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
