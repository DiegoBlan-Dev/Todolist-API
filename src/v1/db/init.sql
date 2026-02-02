CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(30) NOT NULL,
  email VARCHAR(250) NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(120) NOT NULL,
  description VARCHAR
);


ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_user
FOREIGN KEY (user_id)
REFERENCES users (user_id)
ON DELETE CASCADE;
