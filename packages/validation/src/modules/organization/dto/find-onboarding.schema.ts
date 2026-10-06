import { z } from "zod";

export const findOnboardingOutputDtoSchema = z
  .object({
    organizationId: z.uuid(),
    organizationName: z.string(),
    projectId: z.uuid().nullable(),
    projectName: z.string().nullable(),
  })
  .nullable();

export type FindOnboardingOutputDtoType = z.infer<typeof findOnboardingOutputDtoSchema>;
