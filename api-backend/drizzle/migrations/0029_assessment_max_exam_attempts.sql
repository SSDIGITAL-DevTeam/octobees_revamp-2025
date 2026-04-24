ALTER TABLE `assessment_settings`
  ADD COLUMN `max_exam_attempts` int NOT NULL DEFAULT 2;--> statement-breakpoint

ALTER TABLE `assessment_session`
  MODIFY COLUMN `max_exam_attempts` int NOT NULL DEFAULT 2;--> statement-breakpoint

UPDATE `assessment_settings`
SET `max_exam_attempts` = 2
WHERE `max_exam_attempts` IS NULL OR `max_exam_attempts` < 1;--> statement-breakpoint

UPDATE `assessment_session`
SET `max_exam_attempts` = 2
WHERE `max_exam_attempts` IS NULL OR `max_exam_attempts` < 1 OR `max_exam_attempts` = 3;
