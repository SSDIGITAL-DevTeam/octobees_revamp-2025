CREATE TABLE IF NOT EXISTS `benefit` (
	`id` varchar(36) NOT NULL,
	`value` varchar(191) NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	CONSTRAINT `benefit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `blog` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`image` text NOT NULL,
	`content` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`status` enum('Published','Takedown','Draft') NOT NULL,
	`favorite` boolean NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `blog_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `blog_category` (
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
CREATE TABLE IF NOT EXISTS `career` (
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
CREATE TABLE IF NOT EXISTS `categoryservice` (
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
CREATE TABLE IF NOT EXISTS `metatag` (
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
CREATE TABLE IF NOT EXISTS `metas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`content` text,
	`metaable_id` varchar(36) NOT NULL,
	`metaable_type` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `order` (
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
CREATE TABLE IF NOT EXISTS `pages` (
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
CREATE TABLE IF NOT EXISTS `planservice` (
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
CREATE TABLE IF NOT EXISTS `position` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('Active','NonActive') NOT NULL DEFAULT 'Active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `position_id` PRIMARY KEY(`id`),
	CONSTRAINT `position_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `price` (
	`id` varchar(36) NOT NULL,
	`curr` enum('IDR','SGR','MYR') NOT NULL,
	`amount` double NOT NULL,
	`discount` double NOT NULL,
	`idPlan` varchar(191) NOT NULL,
	CONSTRAINT `price_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `role` (
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
CREATE TABLE IF NOT EXISTS `subscription` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`source` varchar(255) NOT NULL,
	`insight` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`status` enum('Draft','Active','NonActive') NOT NULL,
	`refresh_token` text,
	`role` varchar(50) NOT NULL,
	`features` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
-- Guarded FK: blog.category_id -> blog_category.id
SET @fk_name := 'blog_category_id_blog_category_id_fk';
--> statement-breakpoint
SET @ddl := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'blog'
        AND CONSTRAINT_NAME = @fk_name
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    ),
    'SELECT 1',
    'ALTER TABLE `blog` ADD CONSTRAINT `blog_category_id_blog_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON DELETE cascade ON UPDATE no action'
  )
);
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded FK: blog.user_id -> user.id
SET @fk_name := 'blog_user_id_user_id_fk';
--> statement-breakpoint
SET @ddl := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'blog'
        AND CONSTRAINT_NAME = @fk_name
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    ),
    'SELECT 1',
    'ALTER TABLE `blog` ADD CONSTRAINT `blog_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action'
  )
);
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded FK: career.positionId -> position.id
SET @fk_name := 'career_positionId_position_id_fk';
--> statement-breakpoint
SET @ddl := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'career'
        AND CONSTRAINT_NAME = @fk_name
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    ),
    'SELECT 1',
    'ALTER TABLE `career` ADD CONSTRAINT `career_positionId_position_id_fk` FOREIGN KEY (`positionId`) REFERENCES `position`(`id`) ON DELETE cascade ON UPDATE no action'
  )
);
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded FK: metatag.slug -> pages.slug
SET @fk_name := 'metatag_slug_pages_slug_fk';
--> statement-breakpoint
SET @ddl := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'metatag'
        AND CONSTRAINT_NAME = @fk_name
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    ),
    'SELECT 1',
    'ALTER TABLE `metatag` ADD CONSTRAINT `metatag_slug_pages_slug_fk` FOREIGN KEY (`slug`) REFERENCES `pages`(`slug`) ON DELETE cascade ON UPDATE cascade'
  )
);
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
