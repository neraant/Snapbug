import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { z } from "zod";

export const findMembershipInputDtoSchema = z.object({
  userId: z.uuid(),
  organizationId: z.uuid(),
});
export type FindMembershipInputDtoType = z.infer<typeof findMembershipInputDtoSchema>;

export const findMembershipOutputDtoSchema = membershipModelSchema.nullable();
export type FindMembershipOutputDtoType = z.infer<typeof findMembershipOutputDtoSchema>;
