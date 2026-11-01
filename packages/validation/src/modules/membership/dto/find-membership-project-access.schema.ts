import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { z } from "zod";

export const findMembershipProjectAccessInputDtoSchema = z.object({
  membershipId: z.uuid(),
});

export type FindMembershipProjectAccessInputDtoType = z.infer<typeof findMembershipProjectAccessInputDtoSchema>;

export const membershipProjectAccessProjectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: projectColorSchema,
  allowed: z.boolean(),
});

export const findMembershipProjectAccessOutputDtoSchema = z.object({
  membershipId: z.uuid(),
  role: z.enum(UserRole),
  locked: z.boolean(),
  projects: z.array(membershipProjectAccessProjectSchema),
});

export type FindMembershipProjectAccessOutputDtoType = z.infer<typeof findMembershipProjectAccessOutputDtoSchema>;
