import cron from 'node-cron';
import { processBatchScreening, processEligibleBatchCurations } from '../assessment/exam.service.js';
import logger from '../../utils/logger.js';
import { runAffiliateEvaluations } from './affiliate-evaluator.js';

const BATCH_SCREENING_SCHEDULE = process.env.BATCH_SCREENING_CRON || '0 */30 * * * *';
const PERFORMANCE_EVAL_SCHEDULE = process.env.PERFORMANCE_EVAL_CRON || '0 0 * * *'; // default: daily at midnight

let isRunning = false;

export const startBatchScheduler = () => {
  if (isRunning) {
    logger.warn('Batch scheduler already running');
    return;
  }

  logger.info(`Starting batch screening scheduler with cron: ${BATCH_SCREENING_SCHEDULE}`);
  
  cron.schedule(BATCH_SCREENING_SCHEDULE, async () => {
    logger.info('Running scheduled eligible batch curation...');
    try {
      const result = await processEligibleBatchCurations();
      logger.info('Scheduled eligible batch curation completed:', result);
    } catch (error) {
      logger.error('Scheduled eligible batch curation failed:', error);
    }
  }, {
    timezone: 'Asia/Singapore'
  });

  logger.info(`Starting affiliate performance evaluator with cron: ${PERFORMANCE_EVAL_SCHEDULE}`);

  cron.schedule(PERFORMANCE_EVAL_SCHEDULE, async () => {
    logger.info('Running affiliate performance evaluations...');
    try {
        await runAffiliateEvaluations();
        logger.info('Affiliate performance evaluated successfully.');
    } catch (error) {
        logger.error('Performance evaluation scheduling failed:', error);
    }
  }, {
    timezone: 'Asia/Singapore'
  });

  isRunning = true;
  logger.info('Batch screening scheduler started successfully');
};

export const stopBatchScheduler = () => {
  isRunning = false;
  logger.info('Batch screening scheduler stopped');
};

export const triggerBatchScreening = async () => {
  logger.info('Manual batch screening triggered');
  return await processBatchScreening();
};
