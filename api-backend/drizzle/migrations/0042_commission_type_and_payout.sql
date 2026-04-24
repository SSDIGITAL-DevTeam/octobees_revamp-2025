-- Allow lead_id and service_id to be nullable (initial & basic_salary commission has no lead/service)
ALTER TABLE `partner_commission` MODIFY COLUMN `lead_id` varchar(36) NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission` MODIFY COLUMN `service_id` varchar(36) NULL;
--> statement-breakpoint

-- Drop existing FK constraints to re-add with SET NULL behaviour for nullable refs
ALTER TABLE `partner_commission`
  DROP FOREIGN KEY IF EXISTS `partner_commission_lead_id_partner_lead_id_fk`;
--> statement-breakpoint
ALTER TABLE `partner_commission`
  DROP FOREIGN KEY IF EXISTS `partner_commission_service_id_partner_service_id_fk`;
--> statement-breakpoint

-- Re-add FKs with ON DELETE SET NULL for nullable refs
ALTER TABLE `partner_commission`
  ADD CONSTRAINT `partner_commission_lead_id_partner_lead_id_fk`
  FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD CONSTRAINT `partner_commission_service_id_partner_service_id_fk`
  FOREIGN KEY (`service_id`) REFERENCES `partner_service`(`id`) ON DELETE SET NULL;
--> statement-breakpoint

-- Add new columns
ALTER TABLE `partner_commission`
  ADD COLUMN `commission_type` enum('sales','initial','basic_salary') NOT NULL DEFAULT 'sales';
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `period` varchar(7) NULL COMMENT 'YYYY-MM for initial & basic_salary idempotency';
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `paid_by_id` varchar(36) NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `proof_url` varchar(500) NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `transaction_reference` varchar(191) NULL COMMENT 'bank transfer reference number';
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `rejected_at` datetime NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission`
  ADD COLUMN `rejection_reason` text NULL;
--> statement-breakpoint

-- Expand status enum to include Rejected state
ALTER TABLE `partner_commission`
  MODIFY COLUMN `commission_status` enum('Pending Transfer','Paid','Rejected') NOT NULL DEFAULT 'Pending Transfer';
--> statement-breakpoint

-- Unique index for idempotency on initial & basic_salary records per partner per period
CREATE UNIQUE INDEX IF NOT EXISTS `idx_pc_affiliate_period_type`
  ON `partner_commission` (`affiliate_id`, `period`, `commission_type`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_pc_status`
  ON `partner_commission` (`commission_status`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_pc_commission_type`
  ON `partner_commission` (`commission_type`);
