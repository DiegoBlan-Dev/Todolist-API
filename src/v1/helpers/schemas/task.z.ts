import z from "zod";

export const TaskSchema = z.object({
  title: z.string().max(120),
  description: z.string(),
});
