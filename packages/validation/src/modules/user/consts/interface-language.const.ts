import { z } from "zod";

export const interfaceLanguageSchema = z.enum(["en", "ru"]);
export type InterfaceLanguage = z.infer<typeof interfaceLanguageSchema>;
export const interfaceLanguages = ["en", "ru"] as const;
