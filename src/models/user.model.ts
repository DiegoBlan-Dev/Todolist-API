import type { User, UserCredentials } from "../types/user.type.js";
import { pool } from "../db/postgres.js";
import bcrypt from "bcrypt";
import { InvalidCredentials, UserNotFound } from "./errors/user.errors.js";

export class UserModel {
  static async userExists(email: string) {
    const user = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
        `,
      [email],
    );

    return user.rows[0] as User;
  }

  static async insertUser(user: User) {
    const { name, email, password } = user;

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const id = crypto.randomUUID();

    await pool.query(
      `
      INSERT INTO users(user_id,name,email,password)
      VALUES ($1,$2,$3,$4)
      `,
      [id, name, email, hashPassword],
    );

    return id;
  }

  static async authUser(credentials: UserCredentials) {
    const { email, password } = credentials;

    const user = await this.userExists(email);

    if (!user) {
      throw new UserNotFound("El usuario no existe");
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new InvalidCredentials("Credenciales no válidas");
    }

    return user;
  }
}
