import { PERSON_NAME_MAX_LENGTH } from "@workspace/validation/shared/person-name.schema";
import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/user/consts/texts.const";

export const profileNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, validationText.required(texts.profile.displayName.label))
    .max(PERSON_NAME_MAX_LENGTH, texts.profile.displayName.tooLong),
});

export type ProfileNameSchemaType = z.infer<typeof profileNameSchema>;
