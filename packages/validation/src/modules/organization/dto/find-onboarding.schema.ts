import { z } from "zod";

export const findOnboardingOutputDtoSchema = z.object({
  completedAt: z.coerce.date().nullable(),
  suggestedOrganizationName: z.string(),
  organizationId: z.uuid().nullable(),
  organizationName: z.string().nullable(),
  projectId: z.uuid().nullable(),
  projectName: z.string().nullable(),
});

export type FindOnboardingOutputDtoType = z.infer<typeof findOnboardingOutputDtoSchema>;
