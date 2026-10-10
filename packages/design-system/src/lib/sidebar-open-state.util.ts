export const SIDEBAR_OPEN_STATE_COOKIE = "sidebar_state";

export function parseSidebarOpenState(cookieValue: string | undefined, fallback: boolean): boolean {
  if (cookieValue === "true") return true;
  if (cookieValue === "false") return false;
  return fallback;
}
