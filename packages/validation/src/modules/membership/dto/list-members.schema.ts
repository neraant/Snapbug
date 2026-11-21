import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const listMembersInputDtoSchema = z.object({
  organizationId: z
    .uuid()
    .optional()
    .describe("Organization to list; defaults to the caller's primary organization when omitted."),
});

export type ListMembersInputDtoType = z.infer<typeof listMembersInputDtoSchema>;

export const listMembersOutputDtoSchema = z.array(
  z.object({
    userId: z.uuid(),
    name: z.string().nullable(),
    role: z.enum(UserRole),
    email: z.email().optional(),
  }),
);

export type ListMembersOutputDtoType = z.infer<typeof listMembersOutputDtoSchema>;
