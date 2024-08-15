import { z } from "zod";

export const taskSchemas = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
});
