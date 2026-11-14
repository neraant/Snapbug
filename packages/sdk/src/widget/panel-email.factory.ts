import { widgetState } from "../core/widget-state";
import { PANEL_EMAIL_ERROR_ID } from "./panel.const";
import { COPY } from "./widget-copy.const";

export type EmailControl = {
  root: HTMLDivElement;
  input: HTMLInputElement;
  error: HTMLParagraphElement;
  /** Prefills from identify() without overwriting what the user typed. */
  prefill: () => void;
  reset: () => void;
};

export function createEmailControl(): EmailControl {
  const root = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const error = document.createElement("p");

  root.className = "snapbug-field";
  label.className = "snapbug-label";
  label.textContent = COPY.emailLabel;
  label.htmlFor = "snapbug-email";
  input.id = "snapbug-email";
  input.type = "email";
  input.autocomplete = "email";
  input.className = "snapbug-input";
  input.placeholder = COPY.emailPlaceholder;
  error.className = "snapbug-field-error";
  error.id = PANEL_EMAIL_ERROR_ID;
  error.hidden = true;
  root.append(label, input, error);

  const identified = () => widgetState.identifiedEmail ?? "";

  return {
    root,
    input,
    error,
    prefill: () => {
      if (input.value.trim().length === 0) input.value = identified();
    },
    reset: () => {
      input.value = identified();
    },
  };
}
