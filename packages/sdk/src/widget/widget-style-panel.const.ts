export const widgetStylePanel = `
.snapbug.snapbug-panel {
  position: fixed;
  right: 24px;
  bottom: 84px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  width: 420px;
  max-width: calc(100vw - 48px);
  min-width: 0;
  max-height: min(720px, calc(100vh - 108px));
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;
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
  .snapbug .snapbug-severity {
    grid-template-columns: 1fr;
  }

  .snapbug.snapbug-trigger {
    bottom: 72px;
  }

  .snapbug.snapbug-panel {
    right: 0;
    bottom: 72px;
    left: 0;
    width: auto;
    max-width: none;
    max-height: min(calc(90vh - 72px), calc(100% - 72px));
    border-right: none;
    border-bottom: none;
    border-left: none;
    border-radius: 16px 16px 0 0;
  }
}

.snapbug .snapbug-form {
  display: flex;
  flex-direction: column;
  margin: 0;
  min-width: 0;
}

.snapbug .snapbug-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 20px;
}

.snapbug .snapbug-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 0;
  min-width: 0;
}

.snapbug .snapbug-intro {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.snapbug .snapbug-close,
.snapbug .snapbug-icon-button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: calc(var(--radius) - 2px);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    background-color 200ms ease,
    color 200ms ease,
    box-shadow 200ms ease;
}

.snapbug .snapbug-close:hover,
.snapbug .snapbug-icon-button:hover {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
  color: var(--foreground);
}

.snapbug .snapbug-icon-button:hover {
  color: var(--destructive);
}

.snapbug .snapbug-close:focus-visible,
.snapbug .snapbug-icon-button:focus-visible {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-close svg,
.snapbug .snapbug-icon-button svg {
  display: block;
  width: 18px;
  height: 18px;
}

.snapbug .snapbug-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  min-width: 0;
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
  font-weight: 600;
}

.snapbug .snapbug-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.snapbug .snapbug-required {
  color: var(--destructive);
}

.snapbug .snapbug-counter {
  color: var(--muted-foreground);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.snapbug .snapbug-counter-met {
  color: var(--foreground);
}

.snapbug .snapbug-hint {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 1.4;
}

.snapbug .snapbug-severity {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.snapbug .snapbug-severity-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: color-mix(in oklch, var(--foreground) 4%, var(--card));
  color: var(--foreground);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

.snapbug .snapbug-severity-card:hover {
  border-color: color-mix(in oklch, var(--foreground) 24%, var(--border));
}

.snapbug .snapbug-severity-card[aria-checked="true"] {
  border-color: var(--primary);
  background: color-mix(in oklab, var(--primary) 12%, var(--card));
  box-shadow: 0 0 0 1px var(--ring);
}

.snapbug .snapbug-severity-card:focus-visible {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-severity-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.snapbug .snapbug-severity-subtitle {
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 1.3;
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

.snapbug .snapbug-field-error {
  margin: 0;
  color: var(--destructive);
  font-size: 13px;
  line-height: 1.4;
}

.snapbug .snapbug-description-editor {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  max-width: 100%;
  overflow-x: hidden;
}

.snapbug .snapbug-description-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.snapbug .snapbug-description-tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  margin: 0;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

.snapbug .snapbug-description-tool:hover {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
}

.snapbug .snapbug-description-tool:focus-visible {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-description-tool-active {
  border-color: var(--ring);
  background: color-mix(in oklch, var(--ring) 12%, transparent);
  color: var(--foreground);
}

.snapbug .snapbug-description-tool-bold {
  font-weight: 700;
}

.snapbug .snapbug-description-tool-italic {
  font-style: italic;
}

.snapbug .snapbug-description-menu {
  position: relative;
}

.snapbug .snapbug-description-menu-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow-xl);
}

.snapbug .snapbug-description-menu-panel[hidden] {
  display: none;
}

.snapbug .snapbug-description-menu-option {
  margin: 0;
  padding: 6px 8px;
  border: none;
  border-radius: calc(var(--radius) - 2px);
  background: transparent;
  color: var(--foreground);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.snapbug .snapbug-description-menu-option:hover {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
}

.snapbug .snapbug-description-menu-option-active {
  background: color-mix(in oklch, var(--ring) 12%, transparent);
  font-weight: 600;
}

.snapbug .snapbug-description-link-popover {
  display: flex;
  gap: 6px;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow-xl);
}

.snapbug .snapbug-description-link-popover[hidden] {
  display: none;
}

.snapbug .snapbug-description-link-input {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 6px 10px;
  font-size: 13px;
}

.snapbug .snapbug-description-link-apply {
  height: 32px;
  padding: 0 10px;
  font-size: 12px;
}

.snapbug .snapbug-description-textarea {
  min-height: 112px;
  max-height: 260px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.snapbug .snapbug-actions {
  position: sticky;
  bottom: 0;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  background: var(--card);
  min-width: 0;
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
  background: color-mix(in oklab, var(--primary) 85%, var(--foreground));
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
`;
