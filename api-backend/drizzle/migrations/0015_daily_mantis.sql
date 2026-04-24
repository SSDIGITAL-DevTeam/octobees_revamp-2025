CREATE TABLE `affiliate_batch` (
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
CREATE TABLE `assessment_audit_log` (
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
CREATE TABLE `training_content` (
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
ALTER TABLE `affiliate_application` ADD `batch_id` varchar(36);--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD `magic_link_token` varchar(255);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_status` varchar(20) DEFAULT 'not_started';--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_completed_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_embed_viewed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_video_completed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_pdf_pages_viewed` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_agreement_accepted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `exam_must_complete_by` datetime;--> statement-breakpoint
ALTER TABLE `assessment_audit_log` ADD CONSTRAINT `assessment_audit_log_session_id_assessment_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `assessment_session`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD CONSTRAINT `affiliate_application_batch_id_affiliate_batch_id_fk` FOREIGN KEY (`batch_id`) REFERENCES `affiliate_batch`(`id`) ON DELETE no action ON UPDATE no action;
