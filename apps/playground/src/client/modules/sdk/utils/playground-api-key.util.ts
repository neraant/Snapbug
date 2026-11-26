import {
  playgroundApiKeyHashParam,
  playgroundApiKeyStorageKey,
} from "@/client/modules/sdk/consts/playground-api-key.const";

export function readApiKeyFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;

  const value = new URLSearchParams(raw).get(playgroundApiKeyHashParam)?.trim();
  return value ? value : null;
}

export function consumePlaygroundApiKeyFromHash(): string | null {
  const apiKey = readApiKeyFromHash(window.location.hash);
  if (!apiKey) return null;

  const nextUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", nextUrl);
  return apiKey;
}

export function readPlaygroundApiKey(): string | null {
  const value = window.localStorage.getItem(playgroundApiKeyStorageKey)?.trim();
  return value ? value : null;
}

export function writePlaygroundApiKey(apiKey: string): void {
  window.localStorage.setItem(playgroundApiKeyStorageKey, apiKey);
}

export function clearPlaygroundApiKey(): void {
  window.localStorage.removeItem(playgroundApiKeyStorageKey);
}
