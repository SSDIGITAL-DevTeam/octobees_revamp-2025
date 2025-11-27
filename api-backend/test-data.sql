-- Insert Partner Services
INSERT INTO partner_service (id, name, project_value, commission_percentage, description, is_active, created_at, updated_at) VALUES
('ps-001', 'Web Development', 50000000, 15, 'Custom website & web application development', 1, NOW(), NOW()),
('ps-002', 'Marketing Automation', 30000000, 12, 'Workflow setup, CRM integration, and optimization', 1, NOW(), NOW()),
('ps-003', 'Cloud Migration', 75000000, 18, 'Full assessment and migration to scalable cloud infra', 1, NOW(), NOW()),
('ps-004', 'Mobile App Development', 100000000, 15, 'Native and cross-platform mobile application development', 1, NOW(), NOW()),
('ps-005', 'Data Integration', 60000000, 14, 'Enterprise data integration and ETL solutions', 1, NOW(), NOW()),
('ps-006', 'UI/UX Design', 25000000, 10, 'User interface and user experience design services', 1, NOW(), NOW());

-- Insert Test Affiliate Application (if not exists)
INSERT INTO affiliate_application (id, full_name, email, country, strategy, status, created_at, updated_at) VALUES
('test-aff-001', 'Test Partner', 'testpartner@example.com', 'Indonesia', 'Digital marketing and referrals', 'approved', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Insert Test Affiliate User (if not exists)
-- Password: password123 (hashed with bcrypt)
INSERT INTO affiliate_user (id, affiliate_id, email, password_hash, is_active, force_password_change, created_at, updated_at) VALUES
('test-user-001', 'test-aff-001', 'testpartner@example.com', '$2a$10$rKZWvXqKqY5L5xGxN5xGxO5xGxN5xGxN5xGxN5xGxN5xGxN5xGxN5', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Insert Test Leads
INSERT INTO partner_lead (id, affiliate_id, name, email, phone, service_id, project_value, lead_status, remark, created_at, updated_at) VALUES
('lead-001', 'test-aff-001', 'John Doe', 'john@example.com', '+62812345678', 'ps-001', 50000000, 'Lead Created', 'Initial contact made', NOW(), NOW()),
('lead-002', 'test-aff-001', 'Jane Smith', 'jane@example.com', '+62812345679', 'ps-002', 30000000, 'Follow-up', 'Waiting for proposal review', NOW(), NOW()),
('lead-003', 'test-aff-001', 'Bob Wilson', 'bob@example.com', '+62812345680', 'ps-003', 75000000, 'Proposal Sent', 'Proposal sent on Nov 20', NOW(), NOW());

-- Insert Test Commissions
INSERT INTO partner_commission (id, affiliate_id, lead_id, service_id, amount, commission_status, created_at, updated_at) VALUES
('comm-001', 'test-aff-001', 'lead-003', 'ps-003', 13500000, 'Pending Transfer', NOW(), NOW());
