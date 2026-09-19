CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('jobseeker', 'employer')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Full-Time', 'Part-Time', 'Contract', 'Internship')),
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  salary VARCHAR(100),
  company_name VARCHAR(255) NOT NULL,
  company_description TEXT,
  company_contact_email VARCHAR(255) NOT NULL,
  company_contact_phone VARCHAR(50),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'delivered'
    CHECK (status IN ('delivered', 'reviewed', 'invite for interview')),
  resume_name VARCHAR(255),
  resume_path VARCHAR(500),
  resume_size INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, vacancy_id)
);
CREATE INDEX IF NOT EXISTS idx_vacancies_created_by ON vacancies(created_by);
CREATE INDEX IF NOT EXISTS idx_vacancies_created_at ON vacancies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy_id ON applications(vacancy_id);
UPDATE vacancies SET salary = NULL WHERE salary = '';
UPDATE vacancies SET company_description = NULL WHERE company_description = '';
UPDATE vacancies SET company_contact_phone = NULL WHERE company_contact_phone = '';