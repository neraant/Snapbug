import type { ReportSeverity } from "../report/report-submit.types";
import { COPY } from "./widget-copy.const";

export type SeverityControl = {
  root: HTMLDivElement;
  getValue: () => ReportSeverity;
  reset: () => void;
};

const DEFAULT_SEVERITY: ReportSeverity = "low";

const OPTIONS: { value: ReportSeverity; title: string; subtitle: string }[] = [
  { value: "low", title: COPY.severityLowTitle, subtitle: COPY.severityLowSubtitle },
  { value: "high", title: COPY.severityHighTitle, subtitle: COPY.severityHighSubtitle },
  { value: "critical", title: COPY.severityCriticalTitle, subtitle: COPY.severityCriticalSubtitle },
];

export function createSeverityControl(labelId: string): SeverityControl {
  const root = document.createElement("div");
  root.className = "snapbug-severity";
  root.setAttribute("role", "radiogroup");
  root.setAttribute("aria-labelledby", labelId);

  let value: ReportSeverity = DEFAULT_SEVERITY;
  const cards = new Map<ReportSeverity, HTMLButtonElement>();

  const sync = () => {
    for (const [optionValue, card] of cards) {
      const selected = optionValue === value;
      card.setAttribute("aria-checked", String(selected));
      card.tabIndex = selected ? 0 : -1;
    }
  };

  const select = (next: ReportSeverity, focus: boolean) => {
    value = next;
    sync();
    if (focus) cards.get(next)?.focus();
  };

  for (const option of OPTIONS) {
    const card = document.createElement("button");
    const title = document.createElement("span");
    const subtitle = document.createElement("span");
    card.type = "button";
    card.className = "snapbug-severity-card";
    card.setAttribute("role", "radio");
    title.className = "snapbug-severity-title";
    title.textContent = option.title;
    subtitle.className = "snapbug-severity-subtitle";
    subtitle.textContent = option.subtitle;
    card.append(title, subtitle);
    card.addEventListener("click", () => select(option.value, false));
    card.addEventListener("keydown", (event) => {
      const index = OPTIONS.findIndex((item) => item.value === value);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        select(OPTIONS[(index + 1) % OPTIONS.length]!.value, true);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        select(OPTIONS[(index + OPTIONS.length - 1) % OPTIONS.length]!.value, true);
      }
    });
    cards.set(option.value, card);
    root.append(card);
  }
  sync();

  return {
    root,
    getValue: () => value,
    reset: () => select(DEFAULT_SEVERITY, false),
  };
}
