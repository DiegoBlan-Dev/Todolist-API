import type { DatabaseError } from "pg";
import { UserAlreadyExists } from "../errors/auth.errors.js";

const ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
};

export function mapUserQueryError(error: DatabaseError) {
  const { code, constraint } = error;
  if (
    code == ERROR_CODES.UNIQUE_VIOLATION &&
    constraint === "users_email_key"
  ) {
    throw new UserAlreadyExists();
  }
}
