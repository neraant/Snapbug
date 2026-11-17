import { userPreferenceAccentSchema } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import { userPreferenceDensitySchema } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import { userPreferenceThemeSchema } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { z } from "zod";

const userPreferenceCookieSchema = z.object({
  theme: userPreferenceThemeSchema.optional(),
  accent: userPreferenceAccentSchema.optional(),
  density: userPreferenceDensitySchema.optional(),
  reduceMotion: z.boolean().nullable().optional(),
});

export type UserPreferenceCookieMirror = z.infer<typeof userPreferenceCookieSchema>;

export function parseUserPreferenceCookie(raw: string | undefined): UserPreferenceCookieMirror | null {
  if (!raw) return null;

  try {
    const parsed = userPreferenceCookieSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function toUserPreferenceCookieMirror(
  preference: Pick<UserPreferenceModelType, "theme" | "accent" | "density" | "reduceMotion">,
): UserPreferenceCookieMirror {
  return {
    theme: preference.theme,
    accent: preference.accent,
    density: preference.density,
    reduceMotion: preference.reduceMotion,
  };
}
