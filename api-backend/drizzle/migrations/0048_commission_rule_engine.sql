-- ============================================================
-- Commission Rule Engine — schema changes
-- ============================================================

-- 1. Change commission_type from enum to varchar(80) so the rule
--    engine can introduce custom types without future migrations.
ALTER TABLE `partner_commission`
  MODIFY COLUMN `commission_type` varchar(80) NOT NULL DEFAULT 'sales';
--> statement-breakpoint

-- 2. Add rule_id to commission records so we can trace which rule created each one.
ALTER TABLE `partner_commission`
  ADD COLUMN `rule_id` varchar(36) NULL;
--> statement-breakpoint

-- 3. commission_rule — stores each configurable commission rule.
CREATE TABLE `commission_rule` (
  `id`              varchar(36)   NOT NULL,
  `name`            varchar(191)  NOT NULL,
  `description`     text          NULL,
  `trigger_type`    enum('lead_won','daily_cron','monthly_cron','manual') NOT NULL,
  `commission_type` varchar(80)   NOT NULL,
  `rule_scope`      enum('per_lead','per_period') NOT NULL DEFAULT 'per_period',
  `period_scope`    enum('first_month','current_month','any_month') NOT NULL DEFAULT 'current_month',
  `conditions`      json          NULL  COMMENT 'ConditionTree: { operator, groups:[{ operator, conditions:[{field,op,value}] }] }',
  `reward`          json          NULL  COMMENT 'RewardConfig: { type, value?, tiers? }',
  `is_active`       tinyint(1)    NOT NULL DEFAULT 1,
  `priority`        int           NOT NULL DEFAULT 0 COMMENT 'Lower = evaluated first',
  `created_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

CREATE INDEX `idx_cr_trigger_active` ON `commission_rule` (`trigger_type`, `is_active`);
--> statement-breakpoint

-- 4. commission_rule_log — audit trail of every evaluation run.
CREATE TABLE `commission_rule_log` (
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

CREATE INDEX `idx_crl_rule_affiliate` ON `commission_rule_log` (`rule_id`, `affiliate_id`);
--> statement-breakpoint
CREATE INDEX `idx_crl_evaluated_at`   ON `commission_rule_log` (`evaluated_at`);
