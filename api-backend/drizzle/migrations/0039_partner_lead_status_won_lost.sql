-- Step 1: expand enum to include both old and new values (safe for existing data)
ALTER TABLE `partner_lead` MODIFY COLUMN `lead_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Closed Won','Closed Lost','Won','Lost')
  NOT NULL DEFAULT 'New Leads';
--> statement-breakpoint
ALTER TABLE `partner_lead_activity` MODIFY COLUMN `from_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Closed Won','Closed Lost','Won','Lost');
--> statement-breakpoint
ALTER TABLE `partner_lead_activity` MODIFY COLUMN `to_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Closed Won','Closed Lost','Won','Lost');
--> statement-breakpoint
-- Step 2: migrate existing data
UPDATE `partner_lead` SET `lead_status` = 'Won'  WHERE `lead_status` = 'Closed Won';
--> statement-breakpoint
UPDATE `partner_lead` SET `lead_status` = 'Lost' WHERE `lead_status` = 'Closed Lost';
--> statement-breakpoint
UPDATE `partner_lead_activity` SET `from_status` = 'Won'  WHERE `from_status` = 'Closed Won';
--> statement-breakpoint
UPDATE `partner_lead_activity` SET `from_status` = 'Lost' WHERE `from_status` = 'Closed Lost';
--> statement-breakpoint
UPDATE `partner_lead_activity` SET `to_status` = 'Won'  WHERE `to_status` = 'Closed Won';
--> statement-breakpoint
UPDATE `partner_lead_activity` SET `to_status` = 'Lost' WHERE `to_status` = 'Closed Lost';
--> statement-breakpoint
-- Step 3: narrow enum back to final values
ALTER TABLE `partner_lead` MODIFY COLUMN `lead_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Won','Lost')
  NOT NULL DEFAULT 'New Leads';
--> statement-breakpoint
ALTER TABLE `partner_lead_activity` MODIFY COLUMN `from_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Won','Lost');
--> statement-breakpoint
ALTER TABLE `partner_lead_activity` MODIFY COLUMN `to_status`
  enum('New Leads','Contacted','Follow-up Day-1','Follow-up Day-3','Follow-up Day-7','Follow-up Day-14','Won','Lost');
