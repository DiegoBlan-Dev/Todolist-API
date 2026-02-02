import type { RegisterDTO, LoginDTO } from "../types/auth.js";
import {
  comparePasswords,
  hashPassword,
} from "../helpers/auth/hashPassword.js";
import { DatabaseError } from "pg";
import { UserRepository } from "../repository/user.respository.js";
import { mapUserQueryError } from "../helpers/mapUserQueryError.js";
import { InvalidCredentialsError } from "../errors/auth.errors.js";

export async function register(registerDto: RegisterDTO) {
  try {
    const passwordHash = await hashPassword(registerDto.password);

    const newUser = { ...registerDto, password: passwordHash };

    const userId = await UserRepository.create(newUser);

    return userId;
  } catch (error) {
    const databaseError = error as DatabaseError;
    mapUserQueryError(databaseError);
  }
}

export async function login(loginDto: LoginDTO) {
  const { email, password } = loginDto;
  const user = await UserRepository.findByEmail(email);

  const passwordIsValid =
    user && (await comparePasswords(user.password_hash, password));

  if (!passwordIsValid) {
    throw new InvalidCredentialsError();
  }

  return user.user_id;
}
