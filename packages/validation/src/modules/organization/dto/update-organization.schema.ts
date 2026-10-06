import { z } from "zod";

export const updateOrganizationInputDtoSchema = z
  .object({
    organizationId: z.uuid(),
    name: z.string().min(1).optional(),
    reports_retention_days: z.number().int().positive().optional(),
  })
  .refine((data) => data.name !== undefined || data.reports_retention_days !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateOrganizationInputDtoType = z.infer<typeof updateOrganizationInputDtoSchema>;
