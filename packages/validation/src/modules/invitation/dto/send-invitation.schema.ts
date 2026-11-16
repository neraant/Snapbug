import { z } from "zod";

const invitationEmailSchema = z.string().trim().pipe(z.email());

export const sendInvitationsInputDtoSchema = z.object({
  organizationId: z.uuid(),
  emails: z.array(invitationEmailSchema).min(1).max(10),
});

export type SendInvitationsInputDtoType = z.infer<typeof sendInvitationsInputDtoSchema>;

export const sendInvitationsOutputDtoSchema = z.object({
  sent: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  resent: z.number().int().nonnegative(),
});

export type SendInvitationsOutputDtoType = z.infer<typeof sendInvitationsOutputDtoSchema>;