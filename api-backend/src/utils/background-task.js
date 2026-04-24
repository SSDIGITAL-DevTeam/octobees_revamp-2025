import logger from "../../utils/logger.js";

const buildTaskId = (name) =>
  `${name}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;

export const queueBackgroundTask = async (name, task, metadata = {}) => {
  const taskId = buildTaskId(name);
  const lifecycle = metadata.lifecycle || {};
  const sanitizedMetadata = { ...metadata };
  delete sanitizedMetadata.lifecycle;

  logger.info(`Queued background task ${taskId}`, sanitizedMetadata);
  await Promise.resolve(
    lifecycle.onQueued?.({
      taskId,
      status: "queued",
      queuedAt: new Date().toISOString(),
      metadata: sanitizedMetadata,
    }),
  ).catch((error) => {
    logger.error({ err: error, taskId, metadata: sanitizedMetadata }, `Failed to run queued lifecycle for ${taskId}`);
    throw error;
  });

  setTimeout(async () => {
    try {
      logger.info(`Started background task ${taskId}`, sanitizedMetadata);
      await lifecycle.onStarted?.({
        taskId,
        status: "running",
        startedAt: new Date().toISOString(),
        metadata: sanitizedMetadata,
      });
      const result = await task();
      await lifecycle.onCompleted?.({
        taskId,
        status: "completed",
        completedAt: new Date().toISOString(),
        metadata: sanitizedMetadata,
        result,
      });
      logger.info(`Completed background task ${taskId}`, sanitizedMetadata);
    } catch (error) {
      await Promise.resolve(
        lifecycle.onFailed?.({
          taskId,
          status: "failed",
          failedAt: new Date().toISOString(),
          metadata: sanitizedMetadata,
          error,
        }),
      ).catch((lifecycleError) => {
        logger.error({ err: lifecycleError, taskId, metadata: sanitizedMetadata }, `Failed to run failed lifecycle for ${taskId}`);
      });
      logger.error({ err: error, taskId, metadata: sanitizedMetadata }, `Background task ${taskId} failed`);
    }
  }, 0);

  return {
    taskId,
    status: "queued",
    queuedAt: new Date().toISOString(),
  };
};
