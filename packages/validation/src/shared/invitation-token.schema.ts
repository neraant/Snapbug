import { z } from "zod";

export const invitationTokenSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/, "Invalid invitation token");

export type InvitationTokenType = z.infer<typeof invitationTokenSchema>;