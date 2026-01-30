import z from "zod";

export const ZUserSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.email(),
  password: z.string().min(8).max(60),
});

export const ZUserCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(60),
});
