import type { ContentfulStatusCode as Status } from "hono/utils/http-status";

type ErrorType = "AUTH" | "TODO" | "INTERNAL" | "REQUEST";

export class AppError extends Error {
  code: string;
  statusCode: Status;
  type: ErrorType;
  details?: any;

  constructor(
    message: string,
    code: string,
    statusCode: Status,
    type: ErrorType,
    details?: any,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "AppError";
    this.type = type;
    this.details = details ?? null;
  }
}

export class EnvVariableError extends AppError {
  constructor(
    message = "Required environment variables are missing to start the application",
  ) {
    super(message, "ENV_VARIABLE", 500, "INTERNAL");
  }
}
