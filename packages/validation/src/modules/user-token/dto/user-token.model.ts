import { z } from "zod";

export const userTokenModelSchema = z.object({
  id: z.uuid(),
  prefix: z.string(),
  createdAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullable(),
});

export type UserTokenModelType = z.infer<typeof userTokenModelSchema>;
