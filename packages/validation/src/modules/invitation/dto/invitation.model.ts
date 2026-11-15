import { z } from "zod";

export const invitationModelSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullable(),
});

export type InvitationModelType = z.infer<typeof invitationModelSchema>;
