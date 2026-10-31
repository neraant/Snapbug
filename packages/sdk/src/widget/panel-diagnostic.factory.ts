import { infoIcon } from "./panel-icon.factory";
import { createSwitch, type SwitchControl } from "./switch.factory";
import { COPY } from "./widget-copy.const";

export type DiagnosticKey = "replay" | "console" | "network" | "environment";

export type DiagnosticValues = Record<DiagnosticKey, boolean>;

export type DiagnosticControl = {
  root: HTMLDivElement;
  getValues: () => DiagnosticValues;
  reset: () => void;
};

const ROWS: { key: DiagnosticKey; title: string; description: string; tooltip: string }[] = [
  {
    key: "replay",
    title: COPY.diagnosticReplayTitle,
    description: COPY.diagnosticReplayDescription,
    tooltip: COPY.diagnosticReplayTooltip,
  },
  {
    key: "console",
    title: COPY.diagnosticConsoleTitle,
    description: COPY.diagnosticConsoleDescription,
    tooltip: COPY.diagnosticConsoleTooltip,
  },
  {
    key: "network",
    title: COPY.diagnosticNetworkTitle,
    description: COPY.diagnosticNetworkDescription,
    tooltip: COPY.diagnosticNetworkTooltip,
  },
  {
    key: "environment",
    title: COPY.diagnosticEnvironmentTitle,
    description: COPY.diagnosticEnvironmentDescription,
    tooltip: COPY.diagnosticEnvironmentTooltip,
  },
];

export function createDiagnosticControl(): DiagnosticControl {
  const root = document.createElement("div");
  const header = document.createElement("div");
  const heading = document.createElement("h3");
  const counter = document.createElement("span");
  const list = document.createElement("div");
  const switches = new Map<DiagnosticKey, SwitchControl>();

  root.className = "snapbug-diagnostic";
  header.className = "snapbug-diagnostic-header";
  heading.className = "snapbug-diagnostic-heading";
  heading.textContent = COPY.diagnosticHeading;
  counter.className = "snapbug-diagnostic-counter";
  counter.setAttribute("aria-live", "polite");
  list.className = "snapbug-diagnostic-list";
  header.append(heading, counter);

  const syncCounter = () => {
    const active = [...switches.values()].filter((control) => control.isChecked()).length;
    counter.textContent = COPY.diagnosticCounter(active, ROWS.length);
  };

  for (const row of ROWS) {
    const item = document.createElement("div");
    const text = document.createElement("div");
    const titleLine = document.createElement("div");
    const title = document.createElement("span");
    const description = document.createElement("span");
    const tooltip = document.createElement("span");
    const tooltipBubble = document.createElement("span");
    const control = createSwitch(row.title, syncCounter);
    const tooltipId = `snapbug-diagnostic-tooltip-${row.key}`;

    item.className = "snapbug-diagnostic-row";
    text.className = "snapbug-diagnostic-text";
    titleLine.className = "snapbug-diagnostic-title-line";
    title.className = "snapbug-diagnostic-title";
    title.textContent = row.title;
    description.className = "snapbug-diagnostic-description";
    description.textContent = row.description;
    tooltip.className = "snapbug-tooltip";
    tooltip.tabIndex = 0;
    tooltip.setAttribute("aria-label", COPY.diagnosticInfoLabel(row.title));
    tooltip.setAttribute("aria-describedby", tooltipId);
    tooltip.append(infoIcon());
    tooltipBubble.className = "snapbug-tooltip-bubble";
    tooltipBubble.id = tooltipId;
    tooltipBubble.setAttribute("role", "tooltip");
    tooltipBubble.textContent = row.tooltip;
    tooltip.append(tooltipBubble);

    titleLine.append(title, tooltip);
    text.append(titleLine, description);
    item.append(text, control.root);
    list.append(item);
    switches.set(row.key, control);
  }

  root.append(header, list);
  syncCounter();

  return {
    root,
    getValues: () => ({
      replay: switches.get("replay")?.isChecked() ?? true,
      console: switches.get("console")?.isChecked() ?? true,
      network: switches.get("network")?.isChecked() ?? true,
      environment: switches.get("environment")?.isChecked() ?? true,
    }),
    reset: () => {
      for (const control of switches.values()) control.setChecked(true);
      syncCounter();
    },
  };
}
