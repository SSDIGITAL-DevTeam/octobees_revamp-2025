CREATE TABLE IF NOT EXISTS `dpa_lead_demo_request` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `whatsapp_number` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `business_type` varchar(120) NOT NULL,
  `business_type_other` varchar(255),
  `core_problem` text NOT NULL,
  `source` varchar(100) NOT NULL DEFAULT 'dpa-leads-landing-page',
  `status` enum('new','contacted','qualified','converted','lost') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `dpa_lead_demo_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_dpa_lead_demo_request_created_at`
  ON `dpa_lead_demo_request` (`created_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_dpa_lead_demo_request_status`
  ON `dpa_lead_demo_request` (`status`);
