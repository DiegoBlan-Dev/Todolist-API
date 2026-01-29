import { Hono } from "hono";

export const usersRoute = new Hono();

usersRoute.post("/register", async (c) => {});

usersRoute.post("/login", async (c) => {});
