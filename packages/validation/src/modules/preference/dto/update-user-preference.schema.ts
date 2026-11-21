import { userPreferenceThemeSchema } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { userPreferenceModelSchema } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { z } from "zod";

export const updateUserPreferenceInputDtoSchema = z
  .object({
    timeZone: z.string().min(1).optional(),
    theme: userPreferenceThemeSchema.optional(),
  })
  .refine((value) => value.timeZone !== undefined || value.theme !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateUserPreferenceInputDtoType = z.infer<typeof updateUserPreferenceInputDtoSchema>;

export const updateUserPreferenceOutputDtoSchema = userPreferenceModelSchema;

export type UpdateUserPreferenceOutputDtoType = z.infer<typeof updateUserPreferenceOutputDtoSchema>;