import type { UserPreferenceCookieMirror } from "@/shared/user-preference/parse-user-preference-cookie.util";

export function buildUserPreferenceBootScript(mirror: UserPreferenceCookieMirror | null): string {
  if (!mirror) return "";

  const theme = mirror.theme ?? "system";
  const accent = mirror.accent;
  const density = mirror.density;
  const reduceMotion = mirror.reduceMotion;

  const parts: string[] = [];
  const root = "document.documentElement";

  if (theme === "dark") {
    parts.push(`${root}.classList.add('dark')`);
  } else if (theme === "light") {
    parts.push(`${root}.classList.remove('dark')`);
  }

  if (accent) {
    parts.push(`${root}.style.setProperty('--primary', ${JSON.stringify(accent)})`);
  }

  if (density) {
    parts.push(`${root}.dataset.density = ${JSON.stringify(density)}`);
  }

  if (reduceMotion === true) {
    parts.push(`${root}.dataset.reduceMotion = 'true'`);
  } else if (reduceMotion === false) {
    parts.push(`${root}.dataset.reduceMotion = 'false'`);
  }

  if (parts.length === 0) return "";

  return `(() => { try { ${parts.join("; ")}; } catch { /* ignore */ } })();`;
}
