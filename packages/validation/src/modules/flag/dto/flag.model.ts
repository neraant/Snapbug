// @disabled flag
import { z } from "zod";

export const flagModelSchema = z.object({
  settingsVisible: z.boolean(),
});

export type FlagModelType = z.infer<typeof flagModelSchema>;
