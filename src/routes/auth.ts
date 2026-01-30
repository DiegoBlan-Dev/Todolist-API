import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ZUserSchema, ZUserCredentialsSchema } from "../schemas/user.schema.js";
import { treeifyError, ZodError } from "zod";
import { UserModel } from "../models/user.model.js";
import { DatabaseError } from "pg";
import { APIError, UserAlreadyExists } from "../models/errors/user.errors.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT Secret es requerido");
}

export const authRoute = new Hono();

authRoute.onError((error, c) => {
  if (error instanceof SyntaxError) {
    return c.json({ message: "JSON malformado" }, 400);
  }

  if (error instanceof DatabaseError) {
    return c.json({ message: "Database operation failed" }, 500);
  }

  if (error instanceof ZodError) {
    return c.json({ message: treeifyError(error) }, 400);
  }

  if (error instanceof APIError) {
    return c.json({ message: error.message }, error.status);
  }

  return c.json({ message: "Internal server error" }, 500);
});

authRoute.post("/register", async (c) => {
  const data = await c.req.json();

  const validatedData = ZUserSchema.parse(data);

  const user = await UserModel.userExists(validatedData.email);

  if (user) {
    throw new UserAlreadyExists("El usuario ya existe");
  }

  const userId = await UserModel.insertUser(validatedData);

  const payload = {
    user_id: userId,
    user_name: validatedData.name,
  };

  const token = await sign(payload, JWT_SECRET, "HS256");
  setCookie(c, "auth_token", token);
  return c.json({ message: "User created!" }, 201);
});

authRoute.post("/login", async (c) => {
  const data = await c.req.json();

  const validatedData = ZUserCredentialsSchema.parse(data);

  const user = await UserModel.authUser(validatedData);

  const payload = {
    user_id: user.id,
    user_name: user.name,
  };

  const token = await sign(payload, JWT_SECRET, "HS256");
  setCookie(c, "auth_token", token);
  return c.json({ message: "Logged!" });
});

authRoute.post("/logout", async (c) => {
  deleteCookie(c, "auth_token");
  return c.json({ message: "Logout!" });
});
