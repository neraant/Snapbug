import { userPreferenceModelSchema } from "@workspace/validation/modules/preference/dto/user-preference.model";
import type { z } from "zod";

export const findUserPreferenceOutputDtoSchema = userPreferenceModelSchema;

export type FindUserPreferenceOutputDtoType = z.infer<typeof findUserPreferenceOutputDtoSchema>;