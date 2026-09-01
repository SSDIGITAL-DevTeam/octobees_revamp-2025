ALTER TABLE `lead` ADD COLUMN `status` enum('new','contacted','in_progress','won','lost') NOT NULL DEFAULT 'new';
CREATE INDEX `idx_lead_status` ON `lead` (`status`);
