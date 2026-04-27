SET @ddl := (
  SELECT CASE
    WHEN EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'user'
        AND column_name = 'user_status'
    ) THEN 'SELECT 1'
    WHEN EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'user'
        AND column_name = 'plan_status'
    ) THEN 'ALTER TABLE `user` CHANGE COLUMN `plan_status` `user_status` enum(''Draft'',''Active'',''NonActive'') NOT NULL'
    ELSE 'ALTER TABLE `user` ADD COLUMN `user_status` enum(''Draft'',''Active'',''NonActive'') NOT NULL DEFAULT ''Active'''
  END
);
--> statement-breakpoint
PREPARE stmt FROM @ddl;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
