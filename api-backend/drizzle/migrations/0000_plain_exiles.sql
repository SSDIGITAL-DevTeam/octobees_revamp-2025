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
CREATE TABLE `order` (
	`id` varchar(36) NOT NULL,
	`amount` text NOT NULL,
	`bussiness` varchar(255) NOT NULL,
	`date` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone_number` varchar(50) NOT NULL,
	`time` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`plan_status` enum('Draft','Active','NonActive') NOT NULL,
	`refresh_token` text,
	`role` varchar(50) NOT NULL,
	`features` json NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_category_id_blog_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;