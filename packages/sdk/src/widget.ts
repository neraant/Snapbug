export type WidgetConfig = {
  apiKey: string;
  host: string;
};

const BUTTON_ATTR = "data-snapbug-button";
const PANEL_ATTR = "data-snapbug-panel";
const STYLE_ATTR = "data-snapbug-style";

const COPY = {
  trigger: "Report a bug",
  title: "Send Feedback & Bug Report",
  subtitle: "Spotted an issue? Let us know so our team can resolve it quickly.",
  titleLabel: "What went wrong?",
  titlePlaceholder: "e.g., Checkout button fails on final step...",
  descriptionLabel: "Description or steps to reproduce",
  descriptionPlaceholder: "Tell us what you did, what happened, and what you expected to see...",
  submit: "Submit Report",
  sending: "Sending report...",
  cancel: "Cancel",
  successHeading: "Report Received!",
  successMessage: "Thanks for helping us improve. We've received your report and our team will look into it.",
  done: "Done",
  errorHeading: "Couldn't send report",
  errorMessage: "We couldn't send your report. Check your connection and try again.",
  tryAgain: "Try Again",
} as const;

const STYLES = `
.snapbug {
  --primary: oklch(0.693 0.207 42.5);
  --primary-foreground: oklch(1 0 0);
  --card: oklch(1 0 0);
  --foreground: oklch(0.215 0.006 56);
  --muted-foreground: oklch(0.553 0.012 56);
  --destructive: oklch(0.627 0.222 25.5);
  --success: oklch(0.704 0.165 158);
  --border: oklch(0.92 0.005 60);
  --ring: oklch(0.693 0.207 42.5);
  --radius: 0.625rem;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  box-sizing: border-box;
  color: var(--foreground);
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: -0.011em;
}

@media (prefers-color-scheme: dark) {
  .snapbug {
    --primary: oklch(0.693 0.207 42.5);
    --primary-foreground: oklch(0.185 0.006 50);
    --card: oklch(0.215 0.006 56);
    --foreground: oklch(0.965 0.003 75);
    --muted-foreground: oklch(0.695 0.008 60);
    --destructive: oklch(0.68 0.215 25);
    --success: oklch(0.745 0.16 158);
    --border: oklch(0.268 0.006 56);
    --ring: oklch(0.693 0.207 42.5);
  }
}

.snapbug,
.snapbug *,
.snapbug *::before,
.snapbug *::after {
  box-sizing: border-box;
}

.snapbug[hidden],
.snapbug [hidden] {
  display: none !important;
}

.snapbug.snapbug-trigger {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 51;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}

.snapbug.snapbug-trigger:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}

.snapbug.snapbug-trigger:active {
  transform: scale(0.98);
}

.snapbug.snapbug-trigger:focus-visible {
  outline: none;
  box-shadow: var(--shadow-md), 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug.snapbug-trigger svg {
  display: block;
  width: 22px;
  height: 22px;
}

.snapbug.snapbug-panel {
  position: fixed;
  right: 24px;
  bottom: 84px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: min(640px, calc(100vh - 108px));
  overflow: auto;
  margin: 0;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-xl);
  opacity: 0;
  transform: translateY(8px);
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 200ms ease,
    transform 200ms ease,
    visibility 200ms ease,
    box-shadow 200ms ease;
}

.snapbug.snapbug-panel.snapbug-open {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
  pointer-events: auto;
}

@media (max-width: 639px) {
  .snapbug.snapbug-panel {
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    max-height: min(90vh, 100%);
    border-right: none;
    border-bottom: none;
    border-left: none;
    border-radius: 16px 16px 0 0;
  }
}

.snapbug .snapbug-form,
.snapbug .snapbug-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}

.snapbug .snapbug-intro {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.snapbug .snapbug-result .snapbug-primary {
  align-self: flex-end;
}

.snapbug .snapbug-heading {
  margin: 0;
  color: var(--foreground);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.snapbug .snapbug-heading-success {
  color: var(--success);
}

.snapbug .snapbug-heading-error {
  color: var(--destructive);
}

.snapbug .snapbug-subtitle,
.snapbug .snapbug-message {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 14px;
}

.snapbug .snapbug-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.snapbug .snapbug-label {
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
}

.snapbug .snapbug-input,
.snapbug .snapbug-textarea {
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  font: inherit;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.snapbug .snapbug-textarea {
  min-height: 96px;
  resize: vertical;
}

.snapbug .snapbug-input::placeholder,
.snapbug .snapbug-textarea::placeholder {
  color: var(--muted-foreground);
}

.snapbug .snapbug-input:focus-visible,
.snapbug .snapbug-textarea:focus-visible,
.snapbug .snapbug-primary:focus-visible,
.snapbug .snapbug-secondary:focus-visible {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.snapbug .snapbug-primary,
.snapbug .snapbug-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  margin: 0;
  padding: 0 14px;
  border-radius: calc(var(--radius) + 2px);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease,
    color 200ms ease,
    opacity 200ms ease,
    transform 200ms ease;
}

.snapbug .snapbug-primary:active:not(:disabled),
.snapbug .snapbug-secondary:active {
  transform: translateY(1px);
}

.snapbug .snapbug-primary {
  border: 1px solid transparent;
  background: var(--primary);
  color: var(--primary-foreground);
}

.snapbug .snapbug-primary:hover:not(:disabled) {
  background: color-mix(in oklch, var(--primary) 85%, var(--foreground));
}

.snapbug .snapbug-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.snapbug .snapbug-secondary {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--foreground);
}

.snapbug .snapbug-secondary:hover {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .snapbug.snapbug-trigger,
  .snapbug.snapbug-panel,
  .snapbug .snapbug-input,
  .snapbug .snapbug-textarea,
  .snapbug .snapbug-primary,
  .snapbug .snapbug-secondary {
    transition: none;
  }
}
`;

let apiKey: string | null = null;
let host: string | null = null;
let outsideClick: ((event: MouseEvent) => void) | null = null;

function isMounted() {
  return document.querySelector(`[${BUTTON_ATTR}]`) !== null;
}

function bugReportEndpoint(apiHost: string) {
  const origin = /^https?:\/\//i.test(apiHost) ? apiHost : apiHost ? `https://${apiHost}` : location.origin;
  return new URL("/api/bug-reports", origin.endsWith("/") ? origin : `${origin}/`).href;
}

function ensureStyles() {
  if (document.querySelector(`[${STYLE_ATTR}]`)) return;

  const style = document.createElement("style");
  style.setAttribute(STYLE_ATTR, "");
  style.textContent = STYLES;
  document.head.append(style);
}

async function submitReport(title: string, description: string) {
  if (!apiKey) throw new Error("API key is not set");
  if (host === null) throw new Error("Host is not set");

  const response = await fetch(bugReportEndpoint(host), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey, title, description, url: location.href }),
  });

  if (!response.ok) throw new Error("Failed to submit report");

  const body = (await response.json()) as { id: string };

  return body.id;
}

function bugIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  for (const d of [
    "m8 2 1.88 1.88",
    "M14.12 3.88 16 2",
    "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",
    "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
    "M12 20v-9",
    "M6.53 9C4.6 8.8 3 7.1 3 5",
    "M6 13H2",
    "M3 21c0-2.1 1.7-3.9 3.8-4",
    "M20.97 5c0 2.1-1.6 3.8-3.5 4",
    "M22 13h-4",
    "M17.2 17c2.1.1 3.8 1.9 3.8 4",
  ]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.append(path);
  }

  return svg;
}

function createField(labelText: string, control: HTMLInputElement | HTMLTextAreaElement) {
  const field = document.createElement("label");
  const label = document.createElement("span");

  field.className = "snapbug-field";
  label.className = "snapbug-label";
  label.textContent = labelText;
  field.append(label, control);

  return field;
}

function createPanel(trigger: HTMLButtonElement) {
  const panel = document.createElement("div");
  const form = document.createElement("form");
  const intro = document.createElement("div");
  const heading = document.createElement("h2");
  const subtitle = document.createElement("p");
  const title = document.createElement("input");
  const description = document.createElement("textarea");
  const actions = document.createElement("div");
  const submit = document.createElement("button");
  const cancel = document.createElement("button");
  const success = document.createElement("div");
  const successHeading = document.createElement("h2");
  const successMessage = document.createElement("p");
  const done = document.createElement("button");
  const error = document.createElement("div");
  const errorHeading = document.createElement("h2");
  const errorMessage = document.createElement("p");
  const tryAgain = document.createElement("button");
  const formHeadingId = "snapbug-form-heading";
  const successHeadingId = "snapbug-success-heading";
  const errorHeadingId = "snapbug-error-heading";
  let attempt = 0;

  panel.className = "snapbug snapbug-panel";
  panel.setAttribute(PANEL_ATTR, "");
  panel.setAttribute("aria-hidden", "true");
  panel.inert = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", formHeadingId);

  form.className = "snapbug-form";
  intro.className = "snapbug-intro";
  heading.className = "snapbug-heading";
  heading.id = formHeadingId;
  heading.textContent = COPY.title;
  subtitle.className = "snapbug-subtitle";
  subtitle.textContent = COPY.subtitle;

  title.className = "snapbug-input";
  title.required = true;
  title.placeholder = COPY.titlePlaceholder;
  description.className = "snapbug-textarea";
  description.required = true;
  description.placeholder = COPY.descriptionPlaceholder;

  actions.className = "snapbug-actions";
  submit.type = "submit";
  submit.className = "snapbug-primary";
  submit.textContent = COPY.submit;
  cancel.type = "button";
  cancel.className = "snapbug-secondary";
  cancel.textContent = COPY.cancel;

  success.className = "snapbug-result";
  success.hidden = true;
  successHeading.className = "snapbug-heading snapbug-heading-success";
  successHeading.id = successHeadingId;
  successHeading.textContent = COPY.successHeading;
  successMessage.className = "snapbug-message";
  successMessage.textContent = COPY.successMessage;
  done.type = "button";
  done.className = "snapbug-primary";
  done.textContent = COPY.done;

  error.className = "snapbug-result";
  error.hidden = true;
  errorHeading.className = "snapbug-heading snapbug-heading-error";
  errorHeading.id = errorHeadingId;
  errorHeading.textContent = COPY.errorHeading;
  errorMessage.className = "snapbug-message";
  errorMessage.textContent = COPY.errorMessage;
  tryAgain.type = "button";
  tryAgain.className = "snapbug-primary";
  tryAgain.textContent = COPY.tryAgain;

  function showForm() {
    form.hidden = false;
    success.hidden = true;
    error.hidden = true;
    panel.setAttribute("aria-labelledby", formHeadingId);
    submit.disabled = false;
    submit.textContent = COPY.submit;
  }

  function closePanel() {
    attempt += 1;
    if (!success.hidden) resetForm();
    panel.classList.remove("snapbug-open");
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }

  function resetForm() {
    title.value = "";
    description.value = "";
    showForm();
  }

  function openPanel() {
    showForm();
    panel.inert = false;
    panel.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      panel.classList.add("snapbug-open");
      title.focus();
    });
  }

  cancel.addEventListener("click", () => {
    closePanel();
  });

  done.addEventListener("click", () => {
    resetForm();
    closePanel();
  });

  tryAgain.addEventListener("click", () => {
    showForm();
    title.focus();
  });

  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closePanel();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const current = ++attempt;
    submit.disabled = true;
    submit.textContent = COPY.sending;

    try {
      await submitReport(title.value, description.value);
      if (current !== attempt) return;

      form.hidden = true;
      error.hidden = true;
      success.hidden = false;
      panel.setAttribute("aria-labelledby", successHeadingId);
      done.focus();
    } catch {
      if (current !== attempt) return;

      form.hidden = true;
      success.hidden = true;
      error.hidden = false;
      panel.setAttribute("aria-labelledby", errorHeadingId);
      tryAgain.focus();
    }
  });

  actions.append(cancel, submit);
  intro.append(heading, subtitle);
  form.append(intro, createField(COPY.titleLabel, title), createField(COPY.descriptionLabel, description), actions);
  success.append(successHeading, successMessage, done);
  error.append(errorHeading, errorMessage, tryAgain);
  panel.append(form, success, error);

  trigger.addEventListener("click", () => {
    if (panel.classList.contains("snapbug-open")) closePanel();
    else openPanel();
  });

  outsideClick = (event) => {
    if (!panel.classList.contains("snapbug-open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (panel.contains(target) || trigger.contains(target)) return;
    closePanel();
  };
  document.addEventListener("click", outsideClick);

  return panel;
}

function createTrigger() {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "snapbug snapbug-trigger";
  button.setAttribute(BUTTON_ATTR, "");
  button.setAttribute("aria-label", COPY.trigger);
  button.setAttribute("aria-expanded", "false");
  button.title = COPY.trigger;
  button.append(bugIcon());

  return button;
}

export function mountWidget(config: WidgetConfig) {
  if (isMounted()) return;

  apiKey = config.apiKey;
  host = config.host;

  ensureStyles();

  const trigger = createTrigger();
  const panel = createPanel(trigger);

  document.body.append(trigger, panel);
}

export function unmountWidget() {
  if (outsideClick) {
    document.removeEventListener("click", outsideClick);
    outsideClick = null;
  }
  document.querySelector(`[${BUTTON_ATTR}]`)?.remove();
  document.querySelector(`[${PANEL_ATTR}]`)?.remove();
  document.querySelector(`[${STYLE_ATTR}]`)?.remove();
  apiKey = null;
  host = null;
}
