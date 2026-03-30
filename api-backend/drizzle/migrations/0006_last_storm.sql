CREATE TABLE `course` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`banner_url` text NOT NULL,
	`price` double NOT NULL,
	`video_url` text NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_purchase` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`customer_phone` varchar(32) NOT NULL,
	`payment_proof_url` text NOT NULL,
	`status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_purchase_id` PRIMARY KEY(`id`)
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
ALTER TABLE `course_purchase` ADD CONSTRAINT `course_purchase_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE cascade ON UPDATE no action;