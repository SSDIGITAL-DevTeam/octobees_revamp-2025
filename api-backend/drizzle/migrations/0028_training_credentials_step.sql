ALTER TABLE assessment_session
  ADD COLUMN training_credentials_viewed TINYINT(1) NOT NULL DEFAULT 0 AFTER training_pdf_pages_viewed;
