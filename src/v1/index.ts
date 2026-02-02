import "dotenv/config";

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { authRoute } from "./routes/auth.route.js";
import { AppError } from "./errors/app.errors.js";
import { errorResponse } from "./helpers/appResponse.js";
import { todoRoute } from "./routes/todo.route.js";
import { HTTPException } from "hono/http-exception";
import { UnauthorizedError } from "./errors/auth.errors.js";
import { mapHTTPException } from "./helpers/mapHttpException.js";

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof AppError) {
    const response = errorResponse(error, c.req.path);
    return c.json(response, response.statusCode);
  }

  if (error instanceof HTTPException) {
    const errorParsed = mapHTTPException(error);
    const response = errorResponse(errorParsed, c.req.path);
    return c.json(response, error.status);
  }

  return c.json({ message: error }, 500);
});

app.get("/", (c) => c.text("Hello Node.js!"));

app.route("/", authRoute);

app.route("/todos", todoRoute);

serve(app);
