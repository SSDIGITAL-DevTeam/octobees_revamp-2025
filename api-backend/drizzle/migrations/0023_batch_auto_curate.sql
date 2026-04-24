ALTER TABLE `affiliate_batch`
  ADD COLUMN `registration_quota` int NOT NULL DEFAULT 0,
  ADD COLUMN `auto_curate_on_quota_reached` boolean NOT NULL DEFAULT false,
  ADD COLUMN `auto_curate_on_batch_close` boolean NOT NULL DEFAULT true;
