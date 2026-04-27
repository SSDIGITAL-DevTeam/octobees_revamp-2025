CREATE TABLE IF NOT EXISTS `benefit` (
  `id` varchar(36) NOT NULL,
  `value` varchar(191) NOT NULL,
  `idPlan` varchar(191) NOT NULL,
  CONSTRAINT `benefit_id` PRIMARY KEY(`id`)
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
CREATE TABLE IF NOT EXISTS `price` (
  `id` varchar(36) NOT NULL,
  `curr` enum('IDR','SGR','MYR') NOT NULL,
  `amount` double NOT NULL,
  `discount` double NOT NULL,
  `idPlan` varchar(191) NOT NULL,
  CONSTRAINT `price_id` PRIMARY KEY(`id`)
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
CREATE TABLE IF NOT EXISTS `subscription` (
  `id` int AUTO_INCREMENT NOT NULL,
  `email` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `insight` varchar(255),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `subscription_id` PRIMARY KEY(`id`)
);
