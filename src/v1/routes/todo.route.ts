import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { jwt } from "hono/jwt";
import { EnvVariableError } from "../errors/app.errors.js";
import { TaskSchema } from "../helpers/schemas/task.z.js";

import { ZodError } from "zod";
import { formatZodError } from "../helpers/formatZodError.js";
import { InvalidFieldsError } from "../errors/global.errors.js";
import { InvalidJSONBody } from "../errors/global.errors.js";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../services/task.service.js";
import type { TaskDTO } from "../types/task.js";
import { successResponse } from "../helpers/appResponse.js";

type Variables = JwtVariables;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new EnvVariableError();
}

type Payload = {
  user_id: string;
};

export const todoRoute = new Hono<{ Variables: Variables }>();

todoRoute.use(
  "/*",
  jwt({
    secret: JWT_SECRET,
    alg: "HS256",
    cookie: "auth_token",
  }),
);

todoRoute.post("/", async (c) => {
  try {
    const data = await c.req.json();
    const validateData = TaskSchema.parse(data) as TaskDTO;
    const payload = c.get("jwtPayload") as Payload;
    console.log(payload);
    const newTask = await createTask(validateData, payload.user_id);
    const response = successResponse(201, c.req.path, newTask);
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

todoRoute.put("/:id", async (c) => {
  try {
    const taskId = c.req.param("id");
    const data = await c.req.json();
    const validateData = TaskSchema.parse(data) as TaskDTO;
    const payload = c.get("jwtPayload") as Payload;
    const updatedTask = await updateTask(validateData, taskId, payload.user_id);
    const response = successResponse(200, c.req.path, updatedTask);
    return c.json(response);
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

todoRoute.delete("/:id", async (c) => {
  try {
    const taskId = c.req.param("id");
    const payload = c.get("jwtPayload") as Payload;
    const deletedTaskId = await deleteTask(taskId, payload.user_id);
    const response = successResponse(200, c.req.path, deletedTaskId);
    return c.json(response);
  } catch (error) {
    throw error;
  }
});
