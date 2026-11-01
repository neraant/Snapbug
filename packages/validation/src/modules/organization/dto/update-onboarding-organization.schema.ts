import { organizationModelSchema } from "@workspace/validation/modules/organization/dto/organization.model";
import { z } from "zod";

export const updateOnboardingOrganizationInputDtoSchema = z.object({
  organizationId: z.uuid(),
  name: z.string().trim().min(1),
});

export type UpdateOnboardingOrganizationInputDtoType = z.infer<typeof updateOnboardingOrganizationInputDtoSchema>;

export const updateOnboardingOrganizationOutputDtoSchema = organizationModelSchema;

export type UpdateOnboardingOrganizationOutputDtoType = z.infer<typeof updateOnboardingOrganizationOutputDtoSchema>;
