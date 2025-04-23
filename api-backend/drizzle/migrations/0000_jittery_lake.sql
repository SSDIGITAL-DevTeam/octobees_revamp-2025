CREATE TABLE `benefit` (
	`id` varchar(36) NOT NULL,
	`value` varchar(191) NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	CONSTRAINT `benefit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`image` text NOT NULL,
	`content` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`blog_status` enum('Published','Archived','Draft') NOT NULL,
	`favorite` boolean NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `blog_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_category` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`status` boolean NOT NULL,
	CONSTRAINT `blog_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_category_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categoryservice` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`heading` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`status` enum('Draft','Active','NonActive') NOT NULL,
	`slug` varchar(191) NOT NULL,
	CONSTRAINT `categoryservice_id` PRIMARY KEY(`id`),
	CONSTRAINT `categoryservice_name_unique` UNIQUE(`name`),
	CONSTRAINT `categoryservice_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `metatag` (
	`id` varchar(36) NOT NULL,
	`key` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	CONSTRAINT `metatag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` varchar(36) NOT NULL,
	`amount` double NOT NULL,
	`bussiness` varchar(191) NOT NULL,
	`categoryId` varchar(191) NOT NULL,
	`date` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`message` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`phoneNumber` varchar(191) NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	`time` varchar(191) NOT NULL,
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`page` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`categoryServiceId` varchar(191),
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `pages_categoryServiceId_unique` UNIQUE(`categoryServiceId`)
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
	CONSTRAINT `planservice_id` PRIMARY KEY(`id`)
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
CREATE TABLE `role` (
	`id` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`status` enum('Draft','Active','NonActive') NOT NULL,
	`refreshToken` varchar(191),
	`role` varchar(191) NOT NULL,
	`features` json NOT NULL,
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`status` enum('Draft','Active','NonActive') NOT NULL,
	`refresh_token` text,
	`role` varchar(50) NOT NULL,
	`features` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_category_id_blog_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;