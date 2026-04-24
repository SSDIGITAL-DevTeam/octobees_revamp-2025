CREATE TABLE `affiliate_user` (
	`id` varchar(36) NOT NULL,
	`affiliate_id` varchar(36) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_active` tinyint(1) NOT NULL DEFAULT 1,
	`force_password_change` tinyint(1) NOT NULL DEFAULT 1,
	`last_login_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_user_affiliate_id_unique` UNIQUE(`affiliate_id`),
	CONSTRAINT `affiliate_user_email_unique` UNIQUE(`email`),
	CONSTRAINT `affiliate_user_affiliate_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE
);

CREATE TABLE `affiliate_password_token` (
	`id` varchar(36) NOT NULL,
	`affiliate_user_id` varchar(36) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`token_type` enum('initial','reset') NOT NULL DEFAULT 'initial',
	`expires_at` datetime NOT NULL,
	`used_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_password_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_password_token_token_hash_unique` UNIQUE(`token_hash`),
	CONSTRAINT `affiliate_password_token_affiliate_user_id_fk` FOREIGN KEY (`affiliate_user_id`) REFERENCES `affiliate_user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `affiliate_login_log` (
	`id` varchar(36) NOT NULL,
	`affiliate_user_id` varchar(36),
	`ip_address` varchar(64),
	`user_agent` text,
	`status` enum('success','failed') NOT NULL,
	`reason` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_login_log_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_login_log_affiliate_user_id_fk` FOREIGN KEY (`affiliate_user_id`) REFERENCES `affiliate_user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `affiliate_referral` (
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
	`first_interaction_at` datetime DEFAULT (now()),
	`last_conversion_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_referral_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_referral_affiliate_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE
);

CREATE TABLE `affiliate_transaction` (
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
	CONSTRAINT `affiliate_transaction_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_transaction_affiliate_id_fk` FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE CASCADE
);

CREATE INDEX `affiliate_password_token_affiliate_user_id_idx` ON `affiliate_password_token` (`affiliate_user_id`);
CREATE INDEX `affiliate_login_log_affiliate_user_id_idx` ON `affiliate_login_log` (`affiliate_user_id`);
CREATE INDEX `affiliate_referral_affiliate_id_idx` ON `affiliate_referral` (`affiliate_id`);
CREATE INDEX `affiliate_transaction_affiliate_id_idx` ON `affiliate_transaction` (`affiliate_id`);
