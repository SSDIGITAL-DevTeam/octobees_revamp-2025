CREATE TABLE IF NOT EXISTS `affiliate_batch` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`status` enum('open','closed','draft') NOT NULL DEFAULT 'draft',
	`training_video_url` text,
	`training_pdf_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_batch_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `assessment_audit_log` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`event_type` varchar(50) NOT NULL,
	`event_data` text,
	`ip_address` varchar(45),
	`user_agent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `training_content` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`content_type` varchar(50) NOT NULL,
	`content_value` text NOT NULL,
	`order_index` int DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `training_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `affiliate_application` MODIFY COLUMN `status` enum('pending','qualified','approved','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `assessment_question` MODIFY COLUMN `options` text;--> statement-breakpoint
ALTER TABLE `assessment_session` MODIFY COLUMN `session_status` varchar(20) NOT NULL DEFAULT 'not_started';--> statement-breakpoint

-- Guarded ADD COLUMN: affiliate_application.batch_id
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `batch_id` varchar(36)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'batch_id');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: affiliate_application.magic_link_token
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `magic_link_token` varchar(255)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'magic_link_token');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_status
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_status` varchar(20) DEFAULT ''not_started''', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_status');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_completed_at
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_completed_at` datetime', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_completed_at');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_embed_viewed
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_embed_viewed` boolean DEFAULT false', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_embed_viewed');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_video_completed
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_video_completed` boolean DEFAULT false', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_video_completed');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_pdf_pages_viewed
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_pdf_pages_viewed` text', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_pdf_pages_viewed');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.training_agreement_accepted
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `training_agreement_accepted` boolean DEFAULT false', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'training_agreement_accepted');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: assessment_session.exam_must_complete_by
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `assessment_session` ADD `exam_must_complete_by` datetime', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND COLUMN_NAME = 'exam_must_complete_by');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded FK: assessment_audit_log.session_id -> assessment_session.id
SET @fk_name := 'assessment_audit_log_session_id_assessment_session_id_fk';
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_audit_log' AND CONSTRAINT_NAME = @fk_name AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `assessment_audit_log` ADD CONSTRAINT `assessment_audit_log_session_id_assessment_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `assessment_session`(`id`) ON DELETE cascade ON UPDATE no action'));
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded FK: affiliate_application.batch_id -> affiliate_batch.id
SET @fk_name := 'affiliate_application_batch_id_affiliate_batch_id_fk';
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND CONSTRAINT_NAME = @fk_name AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_application` ADD CONSTRAINT `affiliate_application_batch_id_affiliate_batch_id_fk` FOREIGN KEY (`batch_id`) REFERENCES `affiliate_batch`(`id`) ON DELETE no action ON UPDATE no action'));
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
