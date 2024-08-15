import { z } from "zod";

export const createTaskSchemas = z.object({
  title: z.string(),
  description: z.string(),
});

export const updateTaskSchemas = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

export const deleteTaskSchemas = z.object({
  id: z.number(),
});
