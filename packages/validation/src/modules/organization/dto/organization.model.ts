import { z } from "zod";

export const organizationModelSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  reports_retention_days: z.number().int(),
  createdAt: z.iso.datetime(),
});

export type OrganizationModelType = z.infer<typeof organizationModelSchema>;
