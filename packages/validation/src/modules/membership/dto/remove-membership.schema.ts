import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { z } from "zod";

export const removeMembershipInputDtoSchema = z.object({
  membershipId: z.uuid(),
});

export type RemoveMembershipInputDtoType = z.infer<typeof removeMembershipInputDtoSchema>;

export const removeMembershipOutputDtoSchema = membershipModelSchema;

export type RemoveMembershipOutputDtoType = z.infer<typeof removeMembershipOutputDtoSchema>;
