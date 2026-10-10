import { z } from "zod";

export const userModelSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable(),
  email: z.email(),
  onboardingCompletedAt: z.coerce.date().nullable(),
});

export type UserModelType = z.infer<typeof userModelSchema>;
