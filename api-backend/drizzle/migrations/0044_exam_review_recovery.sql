ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_runtime_status` varchar(20) DEFAULT 'idle';
--> statement-breakpoint
ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_queued_at` datetime;
--> statement-breakpoint
ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_started_at` datetime;
--> statement-breakpoint
ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_failed_at` datetime;
--> statement-breakpoint
ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_last_error` text;
--> statement-breakpoint
ALTER TABLE `assessment_session`
  ADD COLUMN `ai_review_retry_count` int NOT NULL DEFAULT 0;
