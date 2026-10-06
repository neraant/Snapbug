import { organizationModelSchema } from "@workspace/validation/modules/organization/dto/organization.model";
import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { z } from "zod";

export const createOrganizationInputDtoSchema = z.object({
  name: z.string().min(1),
  reports_retention_days: z.number().int().positive().optional(),
});

export type CreateOrganizationInputDtoType = z.infer<typeof createOrganizationInputDtoSchema>;

export const createOrganizationOutputDtoSchema = z.object({
  organization: organizationModelSchema,
  project: projectModelSchema,
});

export type CreateOrganizationOutputDtoType = z.infer<typeof createOrganizationOutputDtoSchema>;
