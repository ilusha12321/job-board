-- Users (password123)
INSERT INTO users (username, email, password_hash, role) VALUES
  ('ivan_seeker', 'ivan@test.com', '$2b$10$8OnvjxLrCVzxajVDm7KldOddecUQfn6NpnvSABuZraDWDHaOIey4y', 'jobseeker'),
  ('olga_seeker', 'olga@test.com', '$2b$10$TlnelWjXaNeDz9l4D.deeugwjkIlJ1ZcIVggTMRKRf0uwO4adPb8K', 'jobseeker'),
  ('acme_hr', 'hr@acme.test', '$2b$10$.bPVMfJu84J8ym0oKvvJ9.3madCpJGGd0TX3xcUdhDYfuV1aCNddS', 'employer'),
  ('techcorp_hr', 'hr@techcorp.test', '$2b$10$lpwlGBB4LaFLkn3Mv6RU1.hZauZS/Q1HPkfJ8ur3eqpTTj5EjkFle', 'employer');

-- Vacancies
INSERT INTO vacancies (title, type, location, description, salary, company_name, company_description, company_contact_email, company_contact_phone, created_by)
SELECT 'Frontend Developer', 'Full-Time', 'Kyiv', 'React + TypeScript position', '$1500-2000',
       'Acme Inc', 'A software company', 'hr@acme.test', '+380001112233', id
FROM users WHERE username = 'acme_hr';

INSERT INTO vacancies (title, type, location, description, salary, company_name, company_description, company_contact_email, company_contact_phone, created_by)
SELECT 'Backend Intern', 'Internship', 'Remote', 'Node.js + PostgreSQL internship', NULL,
       'TechCorp', 'A tech startup', 'hr@techcorp.test', NULL, id
FROM users WHERE username = 'techcorp_hr';

INSERT INTO vacancies (title, type, location, description, salary, company_name, company_description, company_contact_email, company_contact_phone, created_by)
SELECT 'QA Engineer', 'Full-Time', 'Lviv', 'Manual + automation testing', '$1200-1600',
       'Acme Inc', 'A software company', 'hr@acme.test', '+380001112233', id
FROM users WHERE username = 'acme_hr';

-- Applications
INSERT INTO applications (user_id, vacancy_id, status)
SELECT (SELECT id FROM users WHERE username = 'ivan_seeker'),
       (SELECT id FROM vacancies WHERE title = 'Frontend Developer'),
       'delivered';

INSERT INTO applications (user_id, vacancy_id, status)
SELECT (SELECT id FROM users WHERE username = 'olga_seeker'),
       (SELECT id FROM vacancies WHERE title = 'Backend Intern'),
       'reviewed';