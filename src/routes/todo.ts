import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

import { TaskSchema } from "../schemas/task.schema.js";
import { TasksModel } from "../models/tasks.model.js";
import type { UserPayload } from "../types/auth.type.js";
import { QueryError } from "../models/errors/tasks.errors.js";
import z, { ZodError } from "zod";

type Variables = JwtVariables;

export const todoRoute = new Hono<{ Variables: Variables }>();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT Secret es requerido");
}

todoRoute.onError((error, c) => {
  if (error instanceof QueryError) {
    return c.json({ message: "Database error" }, 500);
  }

  if (error instanceof ZodError) {
    return c.json({ message: z.treeifyError(error) }, 400);
  }

  return c.json({ message: "Internal Server Error" }, 500);
});

todoRoute.use(
  "/*",
  jwt({
    secret: JWT_SECRET,
    alg: "HS256",
    cookie: "auth_token",
  }),
);

todoRoute.get("/", async (c) => {
  const payload = c.get("jwtPayload") as UserPayload;

  const tasks = await TasksModel.getUserTasks(payload.user_id);

  return c.json({ tasks: tasks });
});

todoRoute.post("/", async (c) => {
  const data = await c.req.json();

  const taskData = TaskSchema.parse(data);

  const payload = c.get("jwtPayload") as UserPayload;

  const newTask = await TasksModel.insertTask(taskData, payload.user_id);

  return c.json(newTask, 201);
});

todoRoute.put("/:id", async (c) => {
  const id = c.req.param("id");
  const payload = c.get("jwtPayload") as UserPayload;
  const data = await c.req.json();
  const validateData = TaskSchema.parse(data);
  const updatedTask = await TasksModel.updateTask(
    payload.user_id,
    id,
    validateData,
  );

  return c.json(updatedTask);
});

todoRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const payload = c.get("jwtPayload") as UserPayload;

  const taskId = await TasksModel.deleteTask(payload.user_id, id);

  return c.json(taskId);
});
