import { pushNetworkEntry } from "./collector-buffer";

let originalFetch: typeof globalThis.fetch | null = null;
let xhrOpen: typeof XMLHttpRequest.prototype.open | null = null;
let xhrSend: typeof XMLHttpRequest.prototype.send | null = null;

export function startNetworkCollector() {
  installFetchCollector();
  installXhrCollector();
}

export function stopNetworkCollector() {
  if (originalFetch) {
    globalThis.fetch = originalFetch;
    originalFetch = null;
  }

  if (xhrOpen) {
    XMLHttpRequest.prototype.open = xhrOpen;
    xhrOpen = null;
  }

  if (xhrSend) {
    XMLHttpRequest.prototype.send = xhrSend;
    xhrSend = null;
  }
}

function recordNetwork(method: string, url: string, status: number, durationMs: number) {
  if (!url || /^blob:|^data:/i.test(url)) return;
  pushNetworkEntry({
    method: method.toUpperCase(),
    url,
    status,
    durationMs: Math.round(durationMs),
  });
}

function installFetchCollector() {
  originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const startedAt = performance.now();
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    const url = resolveFetchUrl(input);

    try {
      const response = await originalFetch!(input, init);
      recordNetwork(method, url, response.status, performance.now() - startedAt);
      return response;
    } catch (error) {
      recordNetwork(method, url, 0, performance.now() - startedAt);
      throw error;
    }
  };
}

function resolveFetchUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function installXhrCollector() {
  xhrOpen = XMLHttpRequest.prototype.open;
  xhrSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, ...args: unknown[]) {
    const method = args[0] as string;
    const url = args[1] as string | URL;
    const meta = this as XMLHttpRequest & { __snapbugMethod?: string; __snapbugUrl?: string };
    meta.__snapbugMethod = method.toUpperCase();
    meta.__snapbugUrl = typeof url === "string" ? url : url.href;
    return (xhrOpen as (...openArgs: unknown[]) => void).apply(this, args);
  } as typeof XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const meta = this as XMLHttpRequest & {
      __snapbugMethod?: string;
      __snapbugUrl?: string;
      __snapbugStarted?: number;
    };
    meta.__snapbugStarted = performance.now();
    this.addEventListener("loadend", () => finalizeXhr(this, meta), { once: true });
    return xhrSend!.call(this, body);
  };
}

function finalizeXhr(
  request: XMLHttpRequest,
  meta: XMLHttpRequest & { __snapbugMethod?: string; __snapbugUrl?: string; __snapbugStarted?: number },
) {
  if (!meta.__snapbugMethod || !meta.__snapbugUrl) return;
  recordNetwork(
    meta.__snapbugMethod,
    meta.__snapbugUrl,
    request.status || 0,
    performance.now() - (meta.__snapbugStarted ?? performance.now()),
  );
}
