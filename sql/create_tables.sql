CREATE DATABASE IF NOT EXISTS student_tracker;
USE student_tracker;

-- users (students + admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'STUDENT',
  roll_no VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  title VARCHAR(200),
  description TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  subject VARCHAR(100),
  marks DECIMAL(5,2),
  max_marks DECIMAL(5,2),
  exam_date DATE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  date DATE,
  status VARCHAR(20),
  notes VARCHAR(255),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Note: No sample data included. Use Workbench to add demo rows later.
