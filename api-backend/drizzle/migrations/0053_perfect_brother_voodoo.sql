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
ALTER TABLE `lead` ADD `voucher_code` varchar(50);