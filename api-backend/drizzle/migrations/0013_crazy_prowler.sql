CREATE TABLE IF NOT EXISTS `assessment_answer` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`question_type` enum('video_introduction','multiple_choice','essay') NOT NULL,
	`video_url` text,
	`selected_option` varchar(255),
	`essay_answer` text,
	`score` double DEFAULT 0,
	`max_score` double NOT NULL,
	`reviewer_score` double,
	`reviewer_feedback` text,
	`is_correct` boolean,
	`answered_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_answer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `assessment_question` (
	`id` varchar(36) NOT NULL,
	`question_type` enum('video_introduction','multiple_choice','essay') NOT NULL,
	`question` text NOT NULL,
	`options` json,
	`correct_answer` text,
	`points` int NOT NULL DEFAULT 1,
	`order_index` int NOT NULL DEFAULT 0,
	`is_required` boolean NOT NULL DEFAULT true,
	`video_instructions` text,
	`max_video_duration` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_question_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `assessment_session` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`session_status` enum('not_started','in_progress','submitted','scored','passed','failed') NOT NULL DEFAULT 'not_started',
	`started_at` datetime,
	`submitted_at` datetime,
	`scored_at` datetime,
	`total_score` double DEFAULT 0,
	`max_score` double DEFAULT 0,
	`percentage` double DEFAULT 0,
	`passing_percentage` int NOT NULL DEFAULT 70,
	`reviewer_id` varchar(36),
	`reviewer_notes` text,
	`is_passed` boolean,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partner_registration_data` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`date_of_birth` date,
	`address` text,
	`city` varchar(191),
	`postal_code` varchar(20),
	`id_card_number` varchar(50),
	`id_card_url` text,
	`selfie_with_id_url` text,
	`emergency_contact_name` varchar(191),
	`emergency_contact_phone` varchar(32),
	`emergency_contact_relation` varchar(50),
	`bank_name` varchar(191),
	`bank_account_number` varchar(50),
	`bank_account_holder` varchar(191),
	`is_completed` boolean NOT NULL DEFAULT false,
	`completed_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_registration_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_registration_data_affiliate_id_unique` UNIQUE(`affiliate_id`)
);
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `city` varchar(191)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'city');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `occupation` varchar(191)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'occupation');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `sales_experience` varchar(20)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'sales_experience');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `has_sold_saas` varchar(10)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'has_sold_saas');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `sales_style` varchar(50)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'sales_style');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `income_goal` varchar(20)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'income_goal');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `hear_about_us` varchar(50)', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'hear_about_us');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `why_choose` text', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'why_choose');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `video_url` text', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'video_url');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `affiliate_application` ADD `resume_url` text', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_application' AND COLUMN_NAME = 'resume_url');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_answer' AND CONSTRAINT_NAME = 'assessment_answer_session_id_assessment_session_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `assessment_answer` ADD CONSTRAINT `assessment_answer_session_id_assessment_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `assessment_session`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_answer' AND CONSTRAINT_NAME = 'assessment_answer_question_id_assessment_question_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `assessment_answer` ADD CONSTRAINT `assessment_answer_question_id_assessment_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `assessment_question`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'assessment_session' AND CONSTRAINT_NAME = 'assessment_session_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `assessment_session` ADD CONSTRAINT `assessment_session_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_registration_data' AND CONSTRAINT_NAME = 'prd_affiliate_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_registration_data` ADD CONSTRAINT `prd_affiliate_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
