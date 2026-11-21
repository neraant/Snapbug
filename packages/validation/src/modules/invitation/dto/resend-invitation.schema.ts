import { invitationModelSchema } from "@workspace/validation/modules/invitation/dto/invitation.model";
import { z } from "zod";

export const resendInvitationInputDtoSchema = z.object({
  invitationId: z.uuid(),
});

export type ResendInvitationInputDtoType = z.infer<typeof resendInvitationInputDtoSchema>;

export const resendInvitationOutputDtoSchema = invitationModelSchema;

export type ResendInvitationOutputDtoType = z.infer<typeof resendInvitationOutputDtoSchema>;
