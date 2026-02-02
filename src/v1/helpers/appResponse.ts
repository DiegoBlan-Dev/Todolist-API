import type { ContentfulStatusCode as Status } from "hono/utils/http-status";
import type { AppError } from "../errors/app.errors.js";

export function successResponse(statusCode: Status, path: string, data?: any) {
  const status = "success";
  return {
    status: status,
    statusCode: statusCode,
    data: data ?? null,
    error: null,
    path: path,
  };
}

export function errorResponse(error: AppError, path: string, data?: any) {
  const status = "error";

  const { statusCode, code, message, details } = error;

  return {
    status: status,
    statusCode: statusCode,
    data: data ?? null,
    error: {
      code: code,
      message: message,
      details: details ?? null,
    },
    path: path,
  };
}
