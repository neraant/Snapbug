import { z } from "zod";

export const copyInvitationLinkInputDtoSchema = z.object({
  invitationId: z.uuid(),
});

export type CopyInvitationLinkInputDtoType = z.infer<typeof copyInvitationLinkInputDtoSchema>;

export const copyInvitationLinkOutputDtoSchema = z.object({
  inviteUrl: z.string().min(1),
});

export type CopyInvitationLinkOutputDtoType = z.infer<typeof copyInvitationLinkOutputDtoSchema>;