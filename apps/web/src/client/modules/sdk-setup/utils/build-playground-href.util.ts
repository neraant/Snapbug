export function playgroundIngestHost(playgroundUrl: string): string {
  return new URL(playgroundUrl).host.toLowerCase();
}

export function buildPlaygroundHref(playgroundUrl: string, apiKey?: string): string {
  const url = new URL(playgroundUrl);
  if (apiKey) url.hash = new URLSearchParams({ apiKey }).toString();
  return url.toString();
}
