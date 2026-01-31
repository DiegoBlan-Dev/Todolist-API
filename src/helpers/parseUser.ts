import type { DBUser } from "../db/postgres/types.js";
import type { User } from "../types/user.type.js";

export function parseDbUser(user: DBUser) {
  const parsedUser: User = {
    id: user.user_id,
    name: user.name,
    email: user.email,
    password: user.password_hash,
  };
  return parsedUser;
}
