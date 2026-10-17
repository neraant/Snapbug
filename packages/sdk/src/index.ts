import { mountWidget, unmountWidget, type WidgetConfig } from "./widget";

export type { WidgetConfig } from "./widget";

export const snapbug = {
  init: (config: WidgetConfig) => {
    const apiKey = config.apiKey.trim();
    if (!apiKey) return;

    mountWidget({ ...config, apiKey, host: config.host.trim().replace(/\/$/, "") });
  },
  destroy: () => {
    unmountWidget();
  },
};
