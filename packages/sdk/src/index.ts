import { mountWidget, unmountWidget } from "./widget";

export const snapbug = {
  init: (config: { apiKey: string; host: string }) => {
    const apiKey = config.apiKey.trim();
    if (!apiKey) return;

    mountWidget({ apiKey, host: config.host.trim().replace(/\/$/, "") });
  },
  destroy: () => {
    unmountWidget();
  },
};
