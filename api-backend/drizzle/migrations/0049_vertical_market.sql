-- Vertical Market feature: add business_vertical + notes to partner_lead,
-- create vertical_market_config table with seeded defaults.

-- 1. Add business_vertical to partner_lead (guarded)
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_lead` ADD COLUMN `business_vertical` varchar(100) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'business_vertical');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- 2. Add custom_project_value to partner_lead (guarded)
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_lead` ADD COLUMN `custom_project_value` double NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'custom_project_value');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- 3. Create vertical_market_config table
CREATE TABLE IF NOT EXISTS `vertical_market_config` (
  `id`          varchar(36)   NOT NULL,
  `name`        varchar(100)  NOT NULL,
  `description` text          NULL,
  `is_active`   tinyint(1)    NOT NULL DEFAULT 1,
  `sort_order`  int           NOT NULL DEFAULT 0,
  `created_at`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vmc_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

-- 4. Seed default vertical markets (idempotent)
INSERT INTO `vertical_market_config` (`id`, `name`, `description`, `is_active`, `sort_order`) VALUES
  ('vmc-digital-agency',  'Digital Agency',          'Digital marketing, web development, and design agencies', 1, 1),
  ('vmc-education',       'Education',               'Schools, universities, training centers, e-learning platforms', 1, 2),
  ('vmc-healthcare',      'Healthcare',              'Hospitals, clinics, medical practices, wellness centers', 1, 3),
  ('vmc-finance',         'Finance & Banking',       'Financial services, banking, insurance, fintech', 1, 4),
  ('vmc-retail',          'Retail & E-commerce',     'Online and offline retail businesses', 1, 5),
  ('vmc-hospitality',     'Hospitality & Tourism',   'Hotels, restaurants, travel agencies', 1, 6),
  ('vmc-realestate',      'Real Estate',             'Property development, brokers, property management', 1, 7),
  ('vmc-manufacturing',   'Manufacturing',           'Production and manufacturing companies', 1, 8),
  ('vmc-logistics',       'Logistics & Supply Chain','Shipping, warehousing, delivery services', 1, 9),
  ('vmc-technology',      'Technology & SaaS',       'Software, hardware, IT services, SaaS companies', 1, 10),
  ('vmc-fmcg',            'FMCG & Consumer Goods',   'Fast-moving consumer goods, food and beverage', 1, 11),
  ('vmc-media',           'Media & Entertainment',   'Publishing, broadcasting, streaming, gaming', 1, 12),
  ('vmc-ngo',             'NGO & Non-Profit',        'Non-governmental organizations and charities', 1, 13),
  ('vmc-government',      'Government & Public Sector','Public institutions and government agencies', 1, 14),
  ('vmc-construction',    'Construction & Engineering','Building contractors, civil engineering firms', 1, 15)
ON DUPLICATE KEY UPDATE `id` = `id`;
