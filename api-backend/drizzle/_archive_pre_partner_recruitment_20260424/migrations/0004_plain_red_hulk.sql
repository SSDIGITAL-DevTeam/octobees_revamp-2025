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
CREATE TABLE `lead` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`companyName` varchar(255),
	`companyWebsite` varchar(255),
	`business` varchar(255),
	`message` text,
	`from` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_id` PRIMARY KEY(`id`)
);
