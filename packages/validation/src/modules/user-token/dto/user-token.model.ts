import { z } from "zod";

export const userTokenModelSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  prefix: z.string(),
  createdAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullable(),
});

export type UserTokenModelType = z.infer<typeof userTokenModelSchema>;
