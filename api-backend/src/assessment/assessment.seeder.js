import express from 'express';
import { db } from '../../drizzle/db.js';
import { assessmentQuestion } from '../../drizzle/schema.js';
import { eq, or, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

const router = express.Router();

const VIDEO_INTERVIEW_QUESTIONS = [
  // Category A — Candidate Background
  {
    type: 'video_introduction',
    question: 'Please introduce yourself — your name, where you are from, and what you currently do professionally. What has your career journey looked like up to this point?',
    points: 10,
    orderIndex: 1,
    category: 'Category A — Candidate Background',
    videoInstructions: 'Introduce yourself by sharing your name, location, current role, and career journey.',
  },
  {
    type: 'video_introduction',
    question: 'What motivated you to explore this opportunity today? What specifically about selling an AI-powered platform appeals to you at this point in your career?',
    points: 10,
    orderIndex: 2,
    category: 'Category A — Candidate Background',
    videoInstructions: 'Explain your motivation for joining and what attracts you to selling AI technology.',
  },
  {
    type: 'video_introduction',
    question: 'Describe the type of work environment where you personally perform at your best. Do you thrive with structure and clear KPIs, or do you prefer freedom and autonomy to find your own methods?',
    points: 10,
    orderIndex: 3,
    category: 'Category A — Candidate Background',
    videoInstructions: 'Describe your ideal work environment and management style.',
  },
  {
    type: 'video_introduction',
    question: 'Where do you see yourself professionally in the next 12 months? What does financial success look like for you, and how does this opportunity fit into that vision?',
    points: 10,
    orderIndex: 4,
    category: 'Category A — Candidate Background',
    videoInstructions: 'Share your professional goals and how this opportunity aligns with your vision.',
  },
  
  // Category B — Sales Experience
  {
    type: 'video_introduction',
    question: 'Walk us through your most significant sales achievement to date. What were you selling, who was your target client, what was the deal size, and how did you close it?',
    points: 15,
    orderIndex: 5,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Describe your biggest sales win with details about the product, client, and deal value.',
  },
  {
    type: 'video_introduction',
    question: 'Describe your typical sales process from prospecting to close. How do you identify leads, build rapport, handle objections, and secure commitment? Be as specific as possible.',
    points: 15,
    orderIndex: 6,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Walk us through your complete sales methodology step by step.',
  },
  {
    type: 'video_introduction',
    question: 'Tell us about a time you lost a deal you expected to win. What happened, what did you learn, and how did you change your approach afterward?',
    points: 15,
    orderIndex: 7,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Share a challenging loss and what it taught you about sales.',
  },
  {
    type: 'video_introduction',
    question: 'Have you ever sold a subscription-based product, SaaS platform, or any recurring revenue service? If yes, what were your key strategies to maintain long-term client retention?',
    points: 15,
    orderIndex: 8,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Discuss your experience with SaaS/reoccurring revenue products.',
  },
  {
    type: 'video_introduction',
    question: 'How do you currently generate your own leads or build your prospect pipeline? What channels do you use, and what has been most effective for you?',
    points: 15,
    orderIndex: 9,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Explain your lead generation and prospecting strategies.',
  },
  {
    type: 'video_introduction',
    question: 'Describe a challenging client objection you faced — one that initially seemed impossible to overcome. How did you handle it, and what was the outcome?',
    points: 15,
    orderIndex: 10,
    category: 'Category B — Sales Experience',
    videoInstructions: 'Share a difficult objection and how you overcame it.',
  },
  
  // Category C — AI Tools Knowledge
  {
    type: 'video_introduction',
    question: 'How familiar are you with AI tools in your current or previous work? List any AI tools, platforms, or automation software you have personally used — and describe what you used them for.',
    points: 10,
    orderIndex: 11,
    category: 'Category C — AI Tools Knowledge',
    videoInstructions: 'Discuss your experience with AI tools and automation software.',
  },
  {
    type: 'video_introduction',
    question: 'In your own words, how would you explain the value of an AI-powered CRM to a small business owner who has never heard of it? How would you make it feel relevant and urgent to them?',
    points: 15,
    orderIndex: 12,
    category: 'Category C — AI Tools Knowledge',
    videoInstructions: 'Explain AI-powered CRM value in simple terms for a non-technical business owner.',
  },
  {
    type: 'video_introduction',
    question: 'Many business owners are skeptical about AI — they worry it will be too complex, too expensive, or replace their staff. How would you address these concerns in a sales conversation?',
    points: 15,
    orderIndex: 13,
    category: 'Category C — AI Tools Knowledge',
    videoInstructions: 'Show how you would handle AI skepticism and objections.',
  },
  {
    type: 'video_introduction',
    question: 'Have you ever sold technology or software products to clients who were not tech-savvy? If yes, what was your communication strategy to bridge that knowledge gap?',
    points: 10,
    orderIndex: 14,
    category: 'Category C — AI Tools Knowledge',
    videoInstructions: 'Share experience selling tech to non-technical clients.',
  },
  {
    type: 'video_introduction',
    question: 'Where do you believe AI-powered business tools are heading in the next 3–5 years? How does this trend create urgency and opportunity for businesses to adopt them now?',
    points: 10,
    orderIndex: 15,
    category: 'Category C — AI Tools Knowledge',
    videoInstructions: 'Share your vision for AI in business and why adoption matters now.',
  },
];

// Seed video interview questions
router.post('/seed-video-questions', async (req, res) => {
  try {
    // Delete existing video questions first
    await db.delete(assessmentQuestion).where(
      eq(assessmentQuestion.questionType, 'video_introduction')
    );
    
    // Insert new questions
    for (const q of VIDEO_INTERVIEW_QUESTIONS) {
      await db.insert(assessmentQuestion).values({
        questionType: q.type,
        question: q.question,
        points: q.points,
        orderIndex: q.orderIndex,
        isRequired: true,
        videoInstructions: q.videoInstructions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    logger.info(`Seeded ${VIDEO_INTERVIEW_QUESTIONS.length} video interview questions`);
    res.json({ 
      status: 'success', 
      message: `Seeded ${VIDEO_INTERVIEW_QUESTIONS.length} video interview questions`,
    });
  } catch (error) {
    logger.error('Error seeding video questions:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get video questions structure
router.get('/video-questions-structure', (req, res) => {
  const structure = {
    categories: [
      {
        name: 'Category A — Candidate Background',
        description: 'Questions about your professional background and motivation',
        questionCount: 4,
        totalPoints: 40,
      },
      {
        name: 'Category B — Sales Experience',
        description: 'Questions about your sales track record and methodology',
        questionCount: 6,
        totalPoints: 90,
      },
      {
        name: 'Category C — AI Tools Knowledge',
        description: 'Questions about your understanding of AI in business',
        questionCount: 5,
        totalPoints: 60,
      },
    ],
    totalQuestions: 15,
    totalPoints: 190,
    estimatedDuration: '45-60 minutes',
  };
  
  res.json({ status: 'success', data: structure });
});

// Exam Questions (multiple choice and essay)
const EXAM_QUESTIONS = [
  // Multiple Choice - AI & Sales Basics
  {
    type: 'multiple_choice',
    question: 'What is the primary advantage of AI-powered CRM systems over traditional CRM systems?',
    options: JSON.stringify([
      { label: 'Lower cost', value: 'a' },
      { label: 'Automated data entry and insights', value: 'b' },
      { label: 'Simpler user interface', value: 'c' },
      { label: 'Better email templates', value: 'd' },
    ]),
    correctAnswer: 'b',
    points: 10,
    orderIndex: 1,
    isRequired: true,
    isActive: true,
  },
  {
    type: 'multiple_choice',
    question: 'Which sales methodology focuses on understanding and solving customer problems before proposing solutions?',
    options: JSON.stringify([
      { label: 'SPIN Selling', value: 'a' },
      { label: 'Consultative Selling', value: 'b' },
      { label: 'Snap Selling', value: 'c' },
      { label: 'Product Push Selling', value: 'd' },
    ]),
    correctAnswer: 'b',
    points: 10,
    orderIndex: 2,
    isRequired: true,
    isActive: true,
  },
  {
    type: 'multiple_choice',
    question: 'In the BANT framework for qualifying leads, what does the "B" stand for?',
    options: JSON.stringify([
      { label: 'Budget', value: 'a' },
      { label: 'Benefits', value: 'b' },
      { label: 'Business Size', value: 'c' },
      { label: 'Brand Fit', value: 'd' },
    ]),
    correctAnswer: 'a',
    points: 10,
    orderIndex: 3,
    isRequired: true,
    isActive: true,
  },
  {
    type: 'multiple_choice',
    question: 'What is the average conversion rate for cold outreach in B2B sales?',
    options: JSON.stringify([
      { label: '1-5%', value: 'a' },
      { label: '10-15%', value: 'b' },
      { label: '25-30%', value: 'c' },
      { label: '40-50%', value: 'd' },
    ]),
    correctAnswer: 'a',
    points: 10,
    orderIndex: 4,
    isRequired: true,
    isActive: true,
  },
  {
    type: 'multiple_choice',
    question: 'Which metric best measures the effectiveness of a sales follow-up sequence?',
    options: JSON.stringify([
      { label: 'Number of emails sent', value: 'a' },
      { label: 'Response rate', value: 'b' },
      { label: 'Time spent on emails', value: 'c' },
      { label: 'Number of templates used', value: 'd' },
    ]),
    correctAnswer: 'b',
    points: 10,
    orderIndex: 5,
    isRequired: true,
    isActive: true,
  },
  
  // Essay Questions
  {
    type: 'essay',
    question: 'Describe your strategy for qualifying a leads as a good fit for AI-powered business solutions. What questions would you ask to determine if a potential client would benefit from our platform?',
    points: 25,
    orderIndex: 6,
    isRequired: true,
    isActive: true,
  },
  {
    type: 'essay',
    question: 'How would you handle a skeptical business owner who believes AI tools are too complex for their team to learn and use effectively?',
    points: 25,
    orderIndex: 7,
    isRequired: true,
    isActive: true,
  },
];

// Seed exam questions
router.post('/seed-exam-questions', async (req, res) => {
  try {
    // Delete existing exam questions first
    await db.delete(assessmentQuestion).where(
      or(
        eq(assessmentQuestion.questionType, 'multiple_choice'),
        eq(assessmentQuestion.questionType, 'essay')
      )
    );
    
    // Insert new questions
    for (const q of EXAM_QUESTIONS) {
      await db.insert(assessmentQuestion).values({
        questionType: q.type,
        question: q.question,
        options: q.options || null,
        correctAnswer: q.correctAnswer || null,
        points: q.points,
        orderIndex: q.orderIndex,
        isRequired: q.isRequired,
        isActive: q.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    logger.info(`Seeded ${EXAM_QUESTIONS.length} exam questions`);
    res.json({ 
      status: 'success', 
      message: `Seeded ${EXAM_QUESTIONS.length} exam questions`,
    });
  } catch (error) {
    logger.error('Error seeding exam questions:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Seed all questions (video + exam)
router.post('/seed-all', async (req, res) => {
  try {
    // Delete all existing questions
    await db.delete(assessmentQuestion);
    
    // Seed video questions
    for (const q of VIDEO_INTERVIEW_QUESTIONS) {
      await db.insert(assessmentQuestion).values({
        questionType: q.type,
        question: q.question,
        points: q.points,
        orderIndex: q.orderIndex,
        isRequired: true,
        videoInstructions: q.videoInstructions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // Seed exam questions
    for (const q of EXAM_QUESTIONS) {
      await db.insert(assessmentQuestion).values({
        questionType: q.type,
        question: q.question,
        options: q.options || null,
        correctAnswer: q.correctAnswer || null,
        points: q.points,
        orderIndex: q.orderIndex + 100, // Offset to avoid conflicts
        isRequired: q.isRequired,
        isActive: q.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    const total = VIDEO_INTERVIEW_QUESTIONS.length + EXAM_QUESTIONS.length;
    logger.info(`Seeded ${total} total questions`);
    res.json({ 
      status: 'success', 
      message: `Seeded ${total} total questions (${VIDEO_INTERVIEW_QUESTIONS.length} video + ${EXAM_QUESTIONS.length} exam)`,
    });
  } catch (error) {
    logger.error('Error seeding all questions:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
