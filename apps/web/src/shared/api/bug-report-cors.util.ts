const BUG_REPORT_INGEST_PATH = "/api/bug-reports";
const WIDGET_CONFIG_PATH = "/api/widget-config";

function normalizePathname(request: Request) {
  return new URL(request.url).pathname.replace(/\/$/, "");
}

export function isBugReportIngestPath(request: Request) {
  return normalizePathname(request) === BUG_REPORT_INGEST_PATH;
}

export function isWidgetConfigPath(request: Request) {
  return normalizePathname(request) === WIDGET_CONFIG_PATH;
}

export function isBugReportPublicCorsPath(request: Request) {
  const pathname = normalizePathname(request);
  return pathname === BUG_REPORT_INGEST_PATH || pathname === WIDGET_CONFIG_PATH;
}

export function bugReportPreflightResponse(request: Request) {
  const allowMethods = isWidgetConfigPath(request) ? "GET, OPTIONS" : "POST, OPTIONS";

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": allowMethods,
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export function withBugReportCors(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
