import { findMembershipProjectAccessOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership-project-access.schema";
import { z } from "zod";

export const replaceMembershipProjectAccessInputDtoSchema = z.object({
  membershipId: z.uuid(),
  projectIds: z.array(z.uuid()),
});

export type ReplaceMembershipProjectAccessInputDtoType = z.infer<typeof replaceMembershipProjectAccessInputDtoSchema>;

export const replaceMembershipProjectAccessOutputDtoSchema = findMembershipProjectAccessOutputDtoSchema;

export type ReplaceMembershipProjectAccessOutputDtoType = z.infer<typeof replaceMembershipProjectAccessOutputDtoSchema>;
