-- Add security fields to assessment_session
ALTER TABLE `assessment_session` ADD COLUMN `exam_token` varchar(36);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `token_used_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `token_invalidated` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `expires_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `total_duration_seconds` int;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `ip_address` varchar(45);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `user_agent` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `browser_fingerprint` varchar(64);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `tab_switch_count` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `time_per_question` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `answer_hash` varchar(64);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `answer_integrity_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD COLUMN `security_flags` text;--> statement-breakpoint

-- Add indexes
ALTER TABLE `assessment_session` ADD INDEX `idx_exam_token` (`exam_token`);
