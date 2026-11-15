import { invitationModelSchema } from "@workspace/validation/modules/invitation/dto/invitation.model";
import { z } from "zod";

export const findInvitationsOutputDtoSchema = z.array(invitationModelSchema);

export type FindInvitationsOutputDtoType = z.infer<typeof findInvitationsOutputDtoSchema>;