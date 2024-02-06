import { z } from "zod";

export const createCommandParams = z.object({
  commandName: z.string(),
  packageJSON: z.string(),
  version: z.string(),
  sourceId: z.string(),
});

export type CreateCommandParams = z.infer<typeof createCommandParams>;
