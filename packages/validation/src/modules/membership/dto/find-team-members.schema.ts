import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const findTeamMembersOutputDtoSchema = z.array(
  z.object({
    id: z.uuid(),
    userId: z.uuid(),
    name: z.string().nullable(),
    email: z.email(),
    role: z.enum(UserRole),
    createdAt: z.iso.datetime(),
  }),
);

export type FindTeamMembersOutputDtoType = z.infer<typeof findTeamMembersOutputDtoSchema>;
