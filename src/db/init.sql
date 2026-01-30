CREATE TABLE users (
  "user_id" uuid NOT NULL PRIMARY KEY,
  "name" varchar(30) NOT NULL,
  "email" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL
);

CREATE TABLE tasks (
  "user_id" uuid NOT NULL,
  "task_id" uuid NOT NULL,
  "title" varchar(120) NOT NULL,
  "description" varchar
);

ALTER TABLE tasks ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");
