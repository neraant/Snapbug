export function apiOrigin(apiHost: string) {
  const origin = /^https?:\/\//i.test(apiHost) ? apiHost : apiHost ? `https://${apiHost}` : location.origin;
  return origin.endsWith("/") ? origin : `${origin}/`;
}

export function bugReportEndpoint(apiHost: string) {
  return new URL("/api/bug-reports", apiOrigin(apiHost)).href;
}

export function widgetConfigEndpoint(apiHost: string, apiKey: string) {
  const url = new URL("/api/widget-config", apiOrigin(apiHost));
  url.searchParams.set("apiKey", apiKey);
  return url.href;
}
