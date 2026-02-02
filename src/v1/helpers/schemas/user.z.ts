import z from "zod";

export const registerDTO = z.object({
  name: z.string().min(3).max(30),
  email: z.email().max(120),
  password: z.string().min(8).max(60),
});

export const loginDTO = z.object({
  email: z.email().max(250),
  password: z.string().min(8).max(60),
});
