import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const updateMembershipRoleInputDtoSchema = z.object({
  membershipId: z.uuid(),
  role: z.enum(UserRole),
});

export type UpdateMembershipRoleInputDtoType = z.infer<typeof updateMembershipRoleInputDtoSchema>;

export const updateMembershipRoleOutputDtoSchema = membershipModelSchema;

export type UpdateMembershipRoleOutputDtoType = z.infer<typeof updateMembershipRoleOutputDtoSchema>;
