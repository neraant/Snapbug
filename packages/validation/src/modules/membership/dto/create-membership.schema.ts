import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { z } from "zod";

export const createMembershipInputDtoSchema = z.object({
  organizationId: z.uuid(),
});

export type CreateMembershipInputDtoType = z.infer<typeof createMembershipInputDtoSchema>;

export const createMembershipOutputDtoSchema = membershipModelSchema;

export type CreateMembershipOutputDtoType = z.infer<typeof createMembershipOutputDtoSchema>;
