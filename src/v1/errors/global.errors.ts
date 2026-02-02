import { AppError } from "./app.errors.js";

export class InvalidFieldsError extends AppError {
  constructor(
    message = "One or more request fields are missing or invalid",
    details: any,
  ) {
    super(message, "INVALID_FIELDS", 400, "REQUEST", details);
  }
}

export class InvalidJSONBody extends AppError {
  constructor(message: string) {
    super(message, "INVALID_JSON_BODY", 400, "REQUEST");
  }
}
