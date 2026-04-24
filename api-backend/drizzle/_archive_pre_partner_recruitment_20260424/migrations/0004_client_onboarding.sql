CREATE TABLE `client_onboarding` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `agreement_guide_approved` boolean NOT NULL DEFAULT false,
  `agreement_program_commitment` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `client_onboarding_id` PRIMARY KEY(`id`),
  CONSTRAINT `client_onboarding_email_unique` UNIQUE(`email`)
);
