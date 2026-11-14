import { interfaceLanguageSchema } from "@workspace/validation/modules/user/consts/interface-language.const";
import { z } from "zod";

export const userModelSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable(),
  email: z.email(),
  interfaceLanguage: interfaceLanguageSchema,
  onboardingCompletedAt: z.coerce.date().nullable(),
});

export type UserModelType = z.infer<typeof userModelSchema>;
