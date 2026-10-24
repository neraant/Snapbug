import { identifyUser, setReportCustomContext } from "../report/report-context.service";
import { closeWidget, mountWidget, openWidget, unmountWidget } from "../widget/widget.service";
import { fetchRemoteWidgetConfig, mergeWidgetConfig } from "./widget-config.service";
import type { WidgetConfig } from "./widget-config.types";

export const snapbug = {
  init: async (config: WidgetConfig) => {
    const apiKey = config.apiKey.trim();
    if (!apiKey) return;

    const host = config.host.trim().replace(/\/$/, "");
    const normalized = { ...config, apiKey, host };
    const remote = await fetchRemoteWidgetConfig(host, apiKey);

    mountWidget(mergeWidgetConfig(normalized, remote));
  },
  destroy: () => {
    unmountWidget();
  },
  open: () => {
    openWidget();
  },
  close: () => {
    closeWidget();
  },
  identify: (options?: { email?: string }) => {
    identifyUser(options);
  },
  setContext: (value: Record<string, unknown> | null) => {
    setReportCustomContext(value);
  },
};
