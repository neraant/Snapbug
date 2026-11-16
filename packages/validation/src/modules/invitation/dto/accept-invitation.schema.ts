import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { invitationTokenSchema } from "@workspace/validation/shared/invitation-token.schema";
import { z } from "zod";

export const acceptInvitationInputDtoSchema = z.object({
  token: invitationTokenSchema,
});

export type AcceptInvitationInputDtoType = z.infer<typeof acceptInvitationInputDtoSchema>;

export const acceptInvitationOutputDtoSchema = membershipModelSchema;

export type AcceptInvitationOutputDtoType = z.infer<typeof acceptInvitationOutputDtoSchema>;
