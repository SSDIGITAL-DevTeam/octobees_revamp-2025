CREATE TABLE IF NOT EXISTS `affiliate_application` (
	`id` varchar(36) NOT NULL,
	`full_name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`country_code` varchar(8),
	`phone` varchar(32),
	`phone_e164` varchar(32),
	`country` varchar(120) NOT NULL,
	`gov_or_business_id` varchar(191),
	`strategy` text NOT NULL,
	`portfolio_links` text,
	`motivation` text,
	`other_programs` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`notes` text,
	`reviewed_at` datetime,
	`reviewer_id` varchar(36),
	`ip_address` varchar(64),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_application_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `affiliate_login_log` (
	`id` varchar(36) NOT NULL,
	`affiliate_user_id` varchar(36),
	`ip_address` varchar(64),
	`user_agent` text,
	`status` enum('success','failed') NOT NULL,
	`reason` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_login_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `affiliate_password_token` (
	`id` varchar(36) NOT NULL,
	`affiliate_user_id` varchar(36) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`token_type` enum('initial','reset') NOT NULL DEFAULT 'initial',
	`expires_at` datetime NOT NULL,
	`used_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_password_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_password_token_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `affiliate_referral` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`referral_name` varchar(191) NOT NULL,
	`referral_email` varchar(191),
	`referral_status` enum('clicked','registered','qualified','purchased') NOT NULL DEFAULT 'clicked',
	`clicks` int NOT NULL DEFAULT 0,
	`signups` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`purchase_amount` double NOT NULL DEFAULT 0,
	`commission_amount` double NOT NULL DEFAULT 0,
	`first_interaction_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`last_conversion_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_referral_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `affiliate_transaction` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`period_start` datetime NOT NULL,
	`period_end` datetime NOT NULL,
	`amount` double NOT NULL DEFAULT 0,
	`transaction_status` enum('pending','processing','paid','failed') NOT NULL DEFAULT 'pending',
	`reference` varchar(64),
	`paid_at` datetime,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `affiliate_user` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`force_password_change` boolean NOT NULL DEFAULT true,
	`last_login_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_user_affiliate_id_unique` UNIQUE(`affiliate_id`),
	CONSTRAINT `affiliate_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partner_commission` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`service_id` varchar(36) NOT NULL,
	`amount` double NOT NULL DEFAULT 0,
	`commission_status` enum('Pending Transfer','Paid') NOT NULL DEFAULT 'Pending Transfer',
	`paid_at` datetime,
	`transaction_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_commission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partner_lead` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`service_id` varchar(36) NOT NULL,
	`project_value` double NOT NULL DEFAULT 0,
	`lead_status` enum('Lead Created','Follow-up','Proposal Sent','Closed Won','Closed Lost') NOT NULL DEFAULT 'Lead Created',
	`remark` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_lead_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partner_service` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`project_value` double NOT NULL DEFAULT 0,
	`commission_percentage` double NOT NULL,
	`description` text NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_login_log' AND CONSTRAINT_NAME = 'affiliate_login_log_affiliate_user_id_affiliate_user_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_login_log` ADD CONSTRAINT `affiliate_login_log_affiliate_user_id_affiliate_user_id_fk` FOREIGN KEY (`affiliate_user_id`) REFERENCES `affiliate_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_password_token' AND CONSTRAINT_NAME = 'affiliate_password_token_affiliate_user_id_affiliate_user_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_password_token` ADD CONSTRAINT `affiliate_password_token_affiliate_user_id_affiliate_user_id_fk` FOREIGN KEY (`affiliate_user_id`) REFERENCES `affiliate_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_referral' AND CONSTRAINT_NAME = 'affiliate_referral_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_referral` ADD CONSTRAINT `affiliate_referral_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_transaction' AND CONSTRAINT_NAME = 'affiliate_transaction_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_transaction` ADD CONSTRAINT `affiliate_transaction_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliate_user' AND CONSTRAINT_NAME = 'affiliate_user_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `affiliate_user` ADD CONSTRAINT `affiliate_user_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_commission' AND CONSTRAINT_NAME = 'partner_commission_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_commission' AND CONSTRAINT_NAME = 'partner_commission_lead_id_partner_lead_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_lead_id_partner_lead_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_commission' AND CONSTRAINT_NAME = 'partner_commission_service_id_partner_service_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_service_id_partner_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `partner_service`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_commission' AND CONSTRAINT_NAME = 'partner_commission_transaction_id_affiliate_transaction_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_commission` ADD CONSTRAINT `partner_commission_transaction_id_affiliate_transaction_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `affiliate_transaction`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND CONSTRAINT_NAME = 'partner_lead_affiliate_id_affiliate_application_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_lead` ADD CONSTRAINT `partner_lead_affiliate_id_affiliate_application_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @ddl := (SELECT IF(EXISTS(SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND CONSTRAINT_NAME = 'partner_lead_service_id_partner_service_id_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'SELECT 1', 'ALTER TABLE `partner_lead` ADD CONSTRAINT `partner_lead_service_id_partner_service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `partner_service`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'));
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
