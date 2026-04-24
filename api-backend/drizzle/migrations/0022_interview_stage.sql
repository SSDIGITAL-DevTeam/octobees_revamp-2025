ALTER TABLE `assessment_session`
  ADD COLUMN `interview_status` varchar(20) DEFAULT 'not_started',
  ADD COLUMN `interview_submitted_link` text,
  ADD COLUMN `interview_submitted_at` datetime,
  ADD COLUMN `interview_invitation_sent_at` datetime,
  ADD COLUMN `training_invitation_sent_at` datetime;
