import type { HTTPException } from "hono/http-exception";
import type { AppError } from "../errors/app.errors.js";

export function mapHTTPException(error: HTTPException) {
  return {
    statusCode: error.status,
    code: "HTTP_EXCEPTION",
    message: error.message,
    details: error.cause ?? null,
  } as AppError;
}
