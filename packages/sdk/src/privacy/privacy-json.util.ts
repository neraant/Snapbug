import { REDACTED } from "./privacy.const";
import type { ScrubbedJsonValue } from "./privacy.types";

export function scrubJsonValue(value: unknown): ScrubbedJsonValue {
  if (value === null) return null;
  if (typeof value === "string") return scrubUrlQueryValues(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((entry) => scrubJsonValue(entry));
  if (typeof value === "object") {
    const result: { [key: string]: ScrubbedJsonValue } = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = scrubJsonValue(entry);
    }
    return result;
  }
  return null;
}

export function scrubUrlQueryValues(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.forEach((_, key) => {
      parsed.searchParams.set(key, REDACTED);
    });
    if (parsed.hash.includes("=")) {
      parsed.hash = REDACTED;
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
