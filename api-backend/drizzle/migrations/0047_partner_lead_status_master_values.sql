ALTER TABLE `partner_lead`
  MODIFY COLUMN `lead_status` varchar(80) NOT NULL DEFAULT 'New Leads';
--> statement-breakpoint
ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `from_status` varchar(80) NULL;
--> statement-breakpoint
ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `to_status` varchar(80) NULL;
