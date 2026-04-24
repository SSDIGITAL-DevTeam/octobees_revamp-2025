CREATE TABLE IF NOT EXISTS `partner_lead_pipeline_status` (
  `id` varchar(36) NOT NULL,
  `value` varchar(80) NOT NULL,
  `label` varchar(120) NOT NULL,
  `color` varchar(32) NOT NULL DEFAULT 'slate',
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` boolean NOT NULL DEFAULT true,
  `is_system` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `partner_lead_pipeline_status_value_unique` (`value`)
);
--> statement-breakpoint
INSERT INTO `partner_lead_pipeline_status`
  (`id`, `value`, `label`, `color`, `sort_order`, `is_active`, `is_system`)
VALUES
  (UUID(), 'New Leads', 'New Leads', 'blue', 1, true, true),
  (UUID(), 'Contacted', 'Contacted', 'purple', 2, true, true),
  (UUID(), 'Follow-up Day-1', 'Follow-up Day-1', 'purple', 3, true, true),
  (UUID(), 'Follow-up Day-3', 'Follow-up Day-3', 'purple', 4, true, true),
  (UUID(), 'Follow-up Day-7', 'Follow-up Day-7', 'purple', 5, true, true),
  (UUID(), 'Follow-up Day-14', 'Follow-up Day-14', 'purple', 6, true, true),
  (UUID(), 'Won', 'Won', 'green', 7, true, true),
  (UUID(), 'Lost', 'Lost', 'red', 8, true, true);
