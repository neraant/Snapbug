import { z } from "zod";

export const userModelSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable(),
  email: z.email(),
});

export type UserModelType = z.infer<typeof userModelSchema>;
