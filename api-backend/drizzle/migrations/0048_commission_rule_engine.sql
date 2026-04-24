-- Commission Rule Engine — schema changes

-- 1. Change commission_type from enum to varchar(80)
ALTER TABLE `partner_commission`
  MODIFY COLUMN `commission_type` varchar(80) NOT NULL DEFAULT 'sales';
--> statement-breakpoint

-- 2. Add rule_id to commission records (guarded)
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_commission` ADD COLUMN `rule_id` varchar(36) NULL', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_commission' AND COLUMN_NAME = 'rule_id');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- 3. commission_rule table
CREATE TABLE IF NOT EXISTS `commission_rule` (
  `id`              varchar(36)   NOT NULL,
  `name`            varchar(191)  NOT NULL,
  `description`     text          NULL,
  `trigger_type`    enum('lead_won','daily_cron','monthly_cron','manual') NOT NULL,
  `commission_type` varchar(80)   NOT NULL,
  `rule_scope`      enum('per_lead','per_period') NOT NULL DEFAULT 'per_period',
  `period_scope`    enum('first_month','current_month','any_month') NOT NULL DEFAULT 'current_month',
  `conditions`      json          NULL,
  `reward`          json          NULL,
  `is_active`       tinyint(1)    NOT NULL DEFAULT 1,
  `priority`        int           NOT NULL DEFAULT 0,
  `created_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

-- Guarded index: idx_cr_trigger_active
SET @sql := (SELECT IF(COUNT(*) = 0, 'CREATE INDEX `idx_cr_trigger_active` ON `commission_rule` (`trigger_type`, `is_active`)', 'SELECT 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'commission_rule' AND INDEX_NAME = 'idx_cr_trigger_active');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- 4. commission_rule_log table
CREATE TABLE IF NOT EXISTS `commission_rule_log` (
  `id`            varchar(36)  NOT NULL,
  `rule_id`       varchar(36)  NOT NULL,
  `affiliate_id`  varchar(36)  NOT NULL,
  `lead_id`       varchar(36)  NULL,
  `period`        varchar(7)   NULL,
  `outcome`       enum('skipped','created','updated','error') NOT NULL,
  `reason`        text         NULL,
  `amount`        double       NULL,
  `evaluated_at`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `crl_rule_id_fk`
    FOREIGN KEY (`rule_id`) REFERENCES `commission_rule` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

-- Guarded index: idx_crl_rule_affiliate
SET @sql := (SELECT IF(COUNT(*) = 0, 'CREATE INDEX `idx_crl_rule_affiliate` ON `commission_rule_log` (`rule_id`, `affiliate_id`)', 'SELECT 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'commission_rule_log' AND INDEX_NAME = 'idx_crl_rule_affiliate');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded index: idx_crl_evaluated_at
SET @sql := (SELECT IF(COUNT(*) = 0, 'CREATE INDEX `idx_crl_evaluated_at` ON `commission_rule_log` (`evaluated_at`)', 'SELECT 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'commission_rule_log' AND INDEX_NAME = 'idx_crl_evaluated_at');
--> statement-breakpoint
PREPARE stmt FROM @sql;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
