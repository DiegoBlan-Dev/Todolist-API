import { Hono } from "hono";
import { loginDTO, registerDTO } from "../helpers/schemas/user.z.js";
import { login, register } from "../services/auth.service.js";

import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { EnvVariableError } from "../errors/app.errors.js";
import { successResponse } from "../helpers/appResponse.js";
import { ZodError } from "zod";
import { formatZodError } from "../helpers/formatZodError.js";
import {
  InvalidFieldsError,
  InvalidJSONBody,
} from "../errors/global.errors.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new EnvVariableError();
}

export const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  try {
    const data = await c.req.json();
    const validateData = registerDTO.parse(data);

    const userId = await register(validateData);

    const payload = {
      user_id: userId,
    };

    const token = await sign(payload, JWT_SECRET, "HS256");

    setCookie(c, "auth_token", token);

    const response = successResponse(201, c.req.path);

    return c.json(response, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = formatZodError(error);
      throw new InvalidFieldsError(undefined, details);
    }

    if (error instanceof SyntaxError) {
      throw new InvalidJSONBody(error.message);
    }

    throw error;
  }
});

authRoute.post("/login", async (c) => {
  try {
    const data = await c.req.json();
    const validateData = loginDTO.parse(data);

    const userId = await login(validateData);

    const payload = {
      user_id: userId,
    };

    const token = await sign(payload, JWT_SECRET, "HS256");

    setCookie(c, "auth_token", token);

    const response = successResponse(201, c.req.path);

    return c.json(response, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = formatZodError(error);
      throw new InvalidFieldsError(undefined, details);
    }

    if (error instanceof SyntaxError) {
      throw new InvalidJSONBody(error.message);
    }

    throw error;
  }
});

authRoute.post("/logout", (c) => {
  deleteCookie(c, "auth_token");
  return c.text("Logout");
});
