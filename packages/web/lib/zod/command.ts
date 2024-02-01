import { z } from "zod";

export const commandParams = z.object({
  commandName: z.string(),
  packageJSON: z.string(),
  version: z.string(),
  sourceId: z.string(),
});

export type CommandParams = z.infer<typeof commandParams>;
