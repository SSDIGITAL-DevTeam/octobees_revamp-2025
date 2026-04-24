-- Allow lead_id and service_id to be nullable (initial & basic_salary commission has no lead/service)
ALTER TABLE `partner_commission` MODIFY COLUMN `lead_id` varchar(36) NULL;
--> statement-breakpoint
ALTER TABLE `partner_commission` MODIFY COLUMN `service_id` varchar(36) NULL;
--> statement-breakpoint

-- Add new columns
ALTER TABLE `partner_commission`
  ADD COLUMN `commission_type` varchar(80) NOT NULL DEFAULT 'sales';
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
ALTER TABLE `partner_commission`
  ADD COLUMN `rule_id` varchar(36) NULL;
--> statement-breakpoint

-- Expand status enum to include Rejected state
ALTER TABLE `partner_commission`
  MODIFY COLUMN `commission_status` enum('Pending Transfer','Paid','Rejected') NOT NULL DEFAULT 'Pending Transfer';
