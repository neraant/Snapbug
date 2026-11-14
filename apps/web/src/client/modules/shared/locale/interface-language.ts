export const interfaceLanguages = ["en", "ru"] as const;
export type InterfaceLanguage = (typeof interfaceLanguages)[number];

let current: InterfaceLanguage = "en";
const listeners = new Set<() => void>();

type InterfaceLanguageStore = {
  getStore: () => InterfaceLanguage | undefined;
  enterWith: (language: InterfaceLanguage) => void;
};

let requestStore: InterfaceLanguageStore | undefined;

export function bindInterfaceLanguageStore(store: InterfaceLanguageStore): void {
  requestStore = store;
}

export function enterInterfaceLanguage(language: InterfaceLanguage): void {
  requestStore?.enterWith(language);
}

function activeInterfaceLanguage(): InterfaceLanguage {
  if (typeof window === "undefined" && requestStore) return requestStore.getStore() ?? "en";
  return current;
}

export function getInterfaceLanguage(): InterfaceLanguage {
  return activeInterfaceLanguage();
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
      const source = (activeInterfaceLanguage() === "ru" ? ru : target) as Record<string, unknown>;
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
