import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const membershipModelSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  organizationId: z.uuid(),
  role: z.enum(UserRole),
  createdAt: z.iso.datetime(),
});

export type MembershipModelType = z.infer<typeof membershipModelSchema>;
