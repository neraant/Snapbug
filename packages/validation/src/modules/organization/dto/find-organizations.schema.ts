import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const findOrganizationsOutputDtoSchema = z.array(
  z.object({
    organizationId: z.uuid(),
    name: z.string(),
    reports_retention_days: z.number().int(),
    role: z.enum(UserRole),
  }),
);

export type FindOrganizationsOutputDtoType = z.infer<typeof findOrganizationsOutputDtoSchema>;
