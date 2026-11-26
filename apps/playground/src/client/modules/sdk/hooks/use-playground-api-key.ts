import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";

import {
  clearPlaygroundApiKey,
  consumePlaygroundApiKeyFromHash,
  readPlaygroundApiKey,
  writePlaygroundApiKey,
} from "@/client/modules/sdk/utils/playground-api-key.util";

type Listener = () => void;

const listeners = new Set<Listener>();

let apiKey: string | null = null;
let hydrated = false;

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string | null {
  return apiKey;
}

function getServerSnapshot(): string | null {
  return null;
}

function hydratePlaygroundApiKey(): void {
  if (hydrated) return;
  hydrated = true;

  const fromHash = consumePlaygroundApiKeyFromHash();
  if (fromHash) {
    writePlaygroundApiKey(fromHash);
    apiKey = fromHash;
    emit();
    return;
  }

  apiKey = readPlaygroundApiKey();
  emit();
}

function connectPlaygroundApiKey(next: string): void {
  const trimmed = next.trim();
  if (!trimmed) return;

  writePlaygroundApiKey(trimmed);
  apiKey = trimmed;
  emit();
}

function forgetPlaygroundApiKey(): void {
  clearPlaygroundApiKey();
  apiKey = null;
  emit();
}

export function usePlaygroundApiKey() {
  const currentApiKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useLayoutEffect(() => {
    hydratePlaygroundApiKey();
  }, []);

  const connect = useCallback((next: string) => {
    connectPlaygroundApiKey(next);
  }, []);

  const forget = useCallback(() => {
    forgetPlaygroundApiKey();
  }, []);

  return { apiKey: currentApiKey, connect, forget };
}
