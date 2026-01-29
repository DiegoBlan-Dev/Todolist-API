import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "q0M1d0X)uF[cg",
  idleTimeoutMillis: 30000,
  port: 5432,
  max: 20,
  min: 10,
});
