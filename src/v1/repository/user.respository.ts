import { pool } from "../db/postgres.js";
import type { RegisterDTO } from "../types/auth.js";
import type { User } from "../types/user.js";

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    const user = await pool.query(
      `
      SELECT * FROM users
      WHERE email = $1
      `,
      [email],
    );

    return user.rows[0] ?? null;
  }

  static async findById(userId: string): Promise<User | null> {
    const user = await pool.query(
      `
      SELECT * FROM users
      WHERE user_id = $1
      `,
      [userId],
    );

    return user.rows[0] ?? null;
  }

  static async create(user: RegisterDTO): Promise<string> {
    const { name, email, password } = user;

    const result = await pool.query(
      `
      INSERT INTO users(name,email,password_hash)
      VALUES ($1,$2,$3)
      RETURNING user_id
      `,
      [name, email, password],
    );

    return result.rows[0].user_id;
  }
}
