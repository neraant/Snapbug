export const interfaceLanguages = ["en", "ru"] as const;
export type InterfaceLanguage = (typeof interfaceLanguages)[number];

let current: InterfaceLanguage = "en";
const listeners = new Set<() => void>();

export function getInterfaceLanguage(): InterfaceLanguage {
  return current;
}

export function setInterfaceLanguage(language: InterfaceLanguage): void {
  if (current === language) return;
  current = language;
  for (const listener of listeners) listener();
}

export function subscribeInterfaceLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function localize<T extends Record<string, unknown>>(en: T, ru: T): T {
  return new Proxy(en, {
    get(target, prop) {
      if (typeof prop === "symbol") return Reflect.get(target, prop);
      const source = (current === "ru" ? ru : target) as Record<string, unknown>;
      const value = source[prop];
      const fallback = (target as Record<string, unknown>)[prop];
      const resolved = value === undefined ? fallback : value;
      if (resolved !== null && typeof resolved === "object" && !Array.isArray(resolved)) {
        const ruChild = ((ru as Record<string, unknown>)[prop] ?? resolved) as Record<string, unknown>;
        return localize(resolved as Record<string, unknown>, ruChild);
      }
      return resolved;
    },
  }) as T;
}
