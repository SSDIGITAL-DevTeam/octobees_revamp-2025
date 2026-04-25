CREATE TABLE `partner_vertical_market` (
  `id` varchar(36) NOT NULL,
  `name` varchar(120) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` boolean NOT NULL DEFAULT true,
  `is_system` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `partner_vertical_market_id` PRIMARY KEY(`id`),
  CONSTRAINT `partner_vertical_market_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint

INSERT INTO `partner_vertical_market`
  (`id`, `name`, `sort_order`, `is_active`, `is_system`)
VALUES
  (UUID(), 'Digital Agency', 1, true, true),
  (UUID(), 'Education', 2, true, true),
  (UUID(), 'Healthcare', 3, true, true),
  (UUID(), 'Real Estate', 4, true, true),
  (UUID(), 'Retail & Ecommerce', 5, true, true),
  (UUID(), 'Food & Beverage', 6, true, true),
  (UUID(), 'Finance & Insurance', 7, true, true),
  (UUID(), 'Professional Services', 8, true, true);
--> statement-breakpoint

ALTER TABLE `partner_lead`
  ADD COLUMN `vertical_market_id` varchar(36) NULL,
  ADD COLUMN `vertical_market_name` varchar(120) NULL,
  ADD COLUMN `is_custom_project_value` boolean NOT NULL DEFAULT false;
--> statement-breakpoint

ALTER TABLE `partner_lead`
  ADD CONSTRAINT `partner_lead_vertical_market_id_partner_vertical_market_id_fk`
  FOREIGN KEY (`vertical_market_id`) REFERENCES `partner_vertical_market`(`id`) ON DELETE SET NULL;
