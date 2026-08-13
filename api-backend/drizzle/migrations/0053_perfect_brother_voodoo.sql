CREATE TABLE `benefit` (
	`id` varchar(36) NOT NULL,
	`value` varchar(191) NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	CONSTRAINT `benefit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `career` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	`positionId` int,
	`resume` text NOT NULL,
	`portfolio` varchar(255) NOT NULL,
	`message` text,
	`status` enum('Rejected','Review','Accepted') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `career_id` PRIMARY KEY(`id`),
	CONSTRAINT `career_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `categoryservice` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`heading` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`status` enum('Draft','Active','NonActive') NOT NULL DEFAULT 'Draft',
	`slug` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categoryservice_id` PRIMARY KEY(`id`),
	CONSTRAINT `categoryservice_name_unique` UNIQUE(`name`),
	CONSTRAINT `categoryservice_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `client_onboarding` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`agreement_guide_approved` boolean NOT NULL DEFAULT false,
	`agreement_program_commitment` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_onboarding_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_onboarding_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `commission_rule` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`trigger_type` enum('lead_won','daily_cron','monthly_cron','manual') NOT NULL,
	`commission_type` varchar(80) NOT NULL,
	`rule_scope` enum('per_lead','per_period') NOT NULL DEFAULT 'per_period',
	`period_scope` enum('first_month','current_month','any_month') NOT NULL DEFAULT 'current_month',
	`conditions` json,
	`reward` json,
	`is_active` boolean NOT NULL DEFAULT true,
	`priority` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commission_rule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commission_rule_log` (
	`id` varchar(36) NOT NULL,
	`rule_id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`lead_id` varchar(36),
	`period` varchar(7),
	`rule_outcome` enum('skipped','created','updated','error') NOT NULL,
	`reason` text,
	`amount` double,
	`evaluated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commission_rule_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dpa_lead_demo_request` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`whatsapp_number` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`business_type` varchar(120) NOT NULL,
	`business_type_other` varchar(255),
	`core_problem` text NOT NULL,
	`source` varchar(100) NOT NULL DEFAULT 'dpa-leads-landing-page',
	`status` enum('new','contacted','qualified','converted','lost') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dpa_lead_demo_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insight_lead` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`from` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insight_lead_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metatag` (
	`id` varchar(36) NOT NULL,
	`key` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metatag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboarding_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`desktop_url` text,
	`mobile_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `onboarding_videos_id` PRIMARY KEY(`id`),
	CONSTRAINT `onboarding_videos_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` varchar(36) NOT NULL,
	`amount` double NOT NULL,
	`currency` enum('IDR','SGD','MYR') NOT NULL DEFAULT 'IDR',
	`bussiness` varchar(191) NOT NULL,
	`categoryId` varchar(191) NOT NULL,
	`date` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`message` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`phoneNumber` varchar(191) NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	`time` varchar(191) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`page` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`source` varchar(191) NOT NULL DEFAULT 'none',
	`categoryServiceId` varchar(191) DEFAULT null,
	`blogId` varchar(191) DEFAULT null,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `partner_lead_activity` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`actor_type` varchar(32) NOT NULL,
	`actor_id` varchar(64),
	`action_type` varchar(64) NOT NULL,
	`from_status` varchar(80),
	`to_status` varchar(80),
	`note` text,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_lead_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_lead_note` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`created_by_type` varchar(20) NOT NULL DEFAULT 'partner',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_lead_note_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_lead_pipeline_status` (
	`id` varchar(36) NOT NULL,
	`value` varchar(80) NOT NULL,
	`label` varchar(120) NOT NULL,
	`color` varchar(32) NOT NULL DEFAULT 'slate',
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`is_system` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_lead_pipeline_status_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_lead_pipeline_status_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `partner_performance_setting` (
	`id` varchar(36) NOT NULL,
	`basic_salary_amount` double NOT NULL DEFAULT 3500,
	`basic_salary_sales_threshold` double NOT NULL DEFAULT 35000,
	`first_month_minimum_closed_clients` int NOT NULL DEFAULT 1,
	`initial_commission_full_client_threshold` int NOT NULL DEFAULT 2,
	`termination_grace_days` int NOT NULL DEFAULT 2,
	`monthly_payout_date` int NOT NULL DEFAULT 25,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_performance_setting_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_vertical_market` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`is_system` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_vertical_market_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_vertical_market_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `planservice` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`type` enum('Standard','Premium') NOT NULL,
	`showPrice` boolean NOT NULL DEFAULT true,
	`status` enum('Draft','Active','NonActive') NOT NULL,
	`options` varchar(191) NOT NULL,
	`descriptions` varchar(191) NOT NULL,
	`categoryId` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `planservice_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `position` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('Active','NonActive') NOT NULL DEFAULT 'Active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `position_id` PRIMARY KEY(`id`),
	CONSTRAINT `position_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `price` (
	`id` varchar(36) NOT NULL,
	`curr` enum('IDR','SGR','MYR') NOT NULL,
	`amount` double NOT NULL,
	`discount` double NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	CONSTRAINT `price_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_material` (
	`id` varchar(36) NOT NULL,
	`title` varchar(191) NOT NULL,
	`summary` text,
	`material_type` enum('rich_text','file','video','link') NOT NULL DEFAULT 'rich_text',
	`content` text,
	`external_url` text,
	`file_url` text,
	`file_name` varchar(255),
	`mime_type` varchar(120),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_material_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`source` varchar(255) NOT NULL,
	`insight` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voucher` (
	`id` varchar(36) NOT NULL,
	`code` varchar(50) NOT NULL,
	`voucher_type` enum('fixed','percentage') NOT NULL,
	`value` double NOT NULL,
	`max_usage` int,
	`current_usage` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voucher_id` PRIMARY KEY(`id`),
	CONSTRAINT `voucher_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `partner_commission` DROP FOREIGN KEY `partner_commission_lead_id_partner_lead_id_fk`;
--> statement-breakpoint
ALTER TABLE `partner_commission` DROP FOREIGN KEY `partner_commission_service_id_partner_service_id_fk`;
--> statement-breakpoint
ALTER TABLE `partner_commission` MODIFY COLUMN `lead_id` varchar(36);--> statement-breakpoint
ALTER TABLE `partner_commission` MODIFY COLUMN `service_id` varchar(36);--> statement-breakpoint
ALTER TABLE `partner_commission` MODIFY COLUMN `commission_status` enum('Pending Transfer','Paid','Rejected') NOT NULL DEFAULT 'Pending Transfer';--> statement-breakpoint
ALTER TABLE `partner_lead` MODIFY COLUMN `lead_status` varchar(80) NOT NULL DEFAULT 'New Leads';--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD `initial_commission_amount` double DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD `performance_alert_sent_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD `performance_termination_due_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_application` ADD `performance_terminated_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `registration_quota` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `auto_curate_on_quota_reached` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `auto_curate_on_batch_close` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `initial_commission_amount` double DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `initial_commission_full_client_threshold` int DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `exam_passing_score` int DEFAULT 70 NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `interview_question_ids` json;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `exam_question_ids` json;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_summary` text;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_decision_rationale` text;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_top_signals` json;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_risk_signals` json;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_ranked_candidates` json;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_trigger` varchar(64);--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_status` varchar(32);--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_task_id` varchar(128);--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_queued_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_started_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_completed_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_failed_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_batch` ADD `ai_screening_error` text;--> statement-breakpoint
ALTER TABLE `affiliate_user` ADD `tnc_agreed_at` datetime;--> statement-breakpoint
ALTER TABLE `affiliate_user` ADD `token_version` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_runtime_status` varchar(20) DEFAULT 'idle';--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_queued_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_started_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_failed_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_last_error` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_review_retry_count` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_status` varchar(20) DEFAULT 'not_started';--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_submitted_link` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_submitted_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_invitation_sent_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_reviewed_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_reviewer_id` varchar(36);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `interview_review_notes` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_invitation_sent_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `exam_invitation_sent_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_video_completed_ids` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `training_credentials_viewed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `exam_attempt_count` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `max_exam_attempts` int DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_settings` ADD `max_exam_attempts` int DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `lead` ADD `voucher_code` varchar(50);--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `commission_type` varchar(80) DEFAULT 'sales' NOT NULL;--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `period` varchar(7);--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `paid_by_id` varchar(36);--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `proof_url` varchar(500);--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `transaction_reference` varchar(191);--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `rejected_at` datetime;--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `rejection_reason` text;--> statement-breakpoint
ALTER TABLE `partner_commission` ADD `rule_id` varchar(36);--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `vertical_market_id` varchar(36);--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `vertical_market_name` varchar(120);--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `is_custom_project_value` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `next_follow_up_at` datetime;--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `last_contact_at` datetime;--> statement-breakpoint
ALTER TABLE `partner_lead` ADD `last_status_changed_at` datetime;--> statement-breakpoint
ALTER TABLE `commission_rule_log` ADD CONSTRAINT `commission_rule_log_rule_id_commission_rule_id_fk` FOREIGN KEY (`rule_id`) REFERENCES `commission_rule`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_lead_activity` ADD CONSTRAINT `partner_lead_activity_lead_id_partner_lead_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_lead_activity` ADD CONSTRAINT `partner_lead_activity_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_lead_note` ADD CONSTRAINT `partner_lead_note_lead_id_partner_lead_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_lead_id_partner_lead_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_service_id_partner_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `partner_service`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partner_lead` ADD CONSTRAINT `partner_lead_vertical_market_id_partner_vertical_market_id_fk` FOREIGN KEY (`vertical_market_id`) REFERENCES `partner_vertical_market`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_question` DROP COLUMN `max_video_duration`;--> statement-breakpoint
ALTER TABLE `partner_lead` DROP COLUMN `remark`;