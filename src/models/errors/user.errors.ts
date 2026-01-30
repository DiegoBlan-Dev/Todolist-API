import type { ContentfulStatusCode } from "hono/utils/http-status";

export class APIError extends Error {
  status: ContentfulStatusCode;
  constructor(message: string, name: string, status: ContentfulStatusCode) {
    super(message);
    this.name = name ?? "APIError";
    this.status = status;
  }
}

export class UserNotFound extends APIError {
  constructor(message: string) {
    super(message, "UserNotFound", 404);
  }
}

export class UserAlreadyExists extends APIError {
  constructor(message: string) {
    super(message, "UserAlreadyExists", 400);
  }
}

export class InvalidCredentials extends APIError {
  constructor(message: string) {
    super(message, "InvalidCredentials", 401);
  }
}
