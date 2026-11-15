import { invitationModelSchema } from "@workspace/validation/modules/invitation/dto/invitation.model";
import { z } from "zod";

export const revokeInvitationInputDtoSchema = z.object({
  invitationId: z.uuid(),
});

export type RevokeInvitationInputDtoType = z.infer<typeof revokeInvitationInputDtoSchema>;

export const revokeInvitationOutputDtoSchema = invitationModelSchema;

export type RevokeInvitationOutputDtoType = z.infer<typeof revokeInvitationOutputDtoSchema>;