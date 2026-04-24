ALTER TABLE `affiliate_batch`
  ADD COLUMN `ai_screening_status` varchar(32),
  ADD COLUMN `ai_screening_task_id` varchar(128),
  ADD COLUMN `ai_screening_queued_at` datetime,
  ADD COLUMN `ai_screening_started_at` datetime,
  ADD COLUMN `ai_screening_failed_at` datetime,
  ADD COLUMN `ai_screening_error` text;
