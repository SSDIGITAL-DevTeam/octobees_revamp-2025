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
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE()
   AND TABLE_NAME = 'dpa_lead_demo_request'
   AND INDEX_NAME = 'idx_dpa_lead_demo_request_created_at') > 0,
  'SELECT "Index idx_dpa_lead_demo_request_created_at exists"',
  'CREATE INDEX idx_dpa_lead_demo_request_created_at ON dpa_lead_demo_request (created_at)'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
--> statement-breakpoint
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE()
   AND TABLE_NAME = 'dpa_lead_demo_request'
   AND INDEX_NAME = 'idx_dpa_lead_demo_request_status') > 0,
  'SELECT "Index idx_dpa_lead_demo_request_status exists"',
  'CREATE INDEX idx_dpa_lead_demo_request_status ON dpa_lead_demo_request (status)'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
