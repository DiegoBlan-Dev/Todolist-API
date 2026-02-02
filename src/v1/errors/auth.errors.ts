import { AppError } from "./app.errors.js";

export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid email or password") {
    super(message, "INVALID_CREDENTIALS", 401, "AUTH");
  }
}

export class UserAlreadyExists extends AppError {
  constructor(message = "A user with this email already exists") {
    super(message, "USER_ALREADY_EXISTS", 400, "AUTH");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to perform this action.") {
    super(message, "UNAUTHORIZED", 401, "AUTH");
  }
}
