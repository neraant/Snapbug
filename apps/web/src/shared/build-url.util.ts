export function buildUrl(
  pattern: string,
  params: Record<string, string | number> = {},
  query: Record<string, string | undefined> = {},
): string {
  const pathname = Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`:${key}`, encodeURIComponent(String(value))),
    pattern,
  );

  return appendQueryParams(pathname, query);
}

export function appendQueryParams(pathname: string, query: Record<string, string | undefined> = {}): string {
  const definedEntries = Object.entries(query).filter((entry): entry is [string, string] => entry[1] !== undefined);

  if (definedEntries.length === 0) {
    return pathname;
  }

  return `${pathname}?${new URLSearchParams(definedEntries).toString()}`;
}

export function matchUrl(pattern: string, pathname: string): Record<string, string> | null {
  const names = (pattern.match(/:(\w+)/g) ?? []).map((token) => token.slice(1));
  const expression = pattern.replace(/\/:\w+/g, "/([^/]+)").replace(/\//g, "\\/");
  const match = pathname.match(new RegExp(`^${expression}$`));

  if (!match) {
    return null;
  }

  return Object.fromEntries(names.map((name, index) => [name, decodeURIComponent(match[index + 1] ?? "")]));
}

const ticketsBase = "/tickets";

export const routePattern = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  onboarding: "/onboarding",

  overview: "/overview",
  playground: "/playground",
  sdk: "/sdk",
  mcp: "/mcp",
  tickets: `${ticketsBase}`,
  ticket: `${ticketsBase}/:shortId`,

  projects: "/projects",
  team: "/team",
  settings: "/settings",
} as const;

export const url = {
  signIn: (query?: { invitation?: string }) => buildUrl(routePattern.signIn, {}, query),
  signUp: (query?: { invitation?: string }) => buildUrl(routePattern.signUp, {}, query),
  forgotPassword: () => routePattern.forgotPassword,
  resetPassword: () => routePattern.resetPassword,
  onboarding: () => routePattern.onboarding,

  overview: () => routePattern.overview,
  playground: () => routePattern.playground,
  sdk: () => routePattern.sdk,
  mcp: () => routePattern.mcp,
  ticketsBoard: () => routePattern.tickets,
  ticket: (shortId: string) => buildUrl(routePattern.ticket, { shortId }),

  projects: () => routePattern.projects,
  team: () => routePattern.team,
  settings: () => routePattern.settings,
} as const;
