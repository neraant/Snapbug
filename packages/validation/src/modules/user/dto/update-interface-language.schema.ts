import { interfaceLanguageSchema } from "@workspace/validation/modules/user/consts/interface-language.const";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const updateInterfaceLanguageInputDtoSchema = z.object({
  interfaceLanguage: interfaceLanguageSchema,
});
export type UpdateInterfaceLanguageInputDtoType = z.infer<typeof updateInterfaceLanguageInputDtoSchema>;

export const updateInterfaceLanguageOutputDtoSchema = userModelSchema;
export type UpdateInterfaceLanguageOutputDtoType = z.infer<typeof updateInterfaceLanguageOutputDtoSchema>;
