import { interfaceLanguageSchema } from "@workspace/validation/modules/user/consts/interface-language.const";
import { z } from "zod";

export const interfaceLanguageFormSchema = z.object({
  interfaceLanguage: interfaceLanguageSchema,
});

export type InterfaceLanguageFormSchemaType = z.infer<typeof interfaceLanguageFormSchema>;
