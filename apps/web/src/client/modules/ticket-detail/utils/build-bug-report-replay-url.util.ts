export function buildBugReportReplayUrl(shortId: string): string {
  const params = new URLSearchParams({ shortId });
  if (typeof window !== "undefined") {
    return new URL(`/api/bug-reports/replay?${params}`, window.location.origin).href;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required to build bug report replay URLs");
  }

  return new URL(`/api/bug-reports/replay?${params}`, baseUrl).href;
}
