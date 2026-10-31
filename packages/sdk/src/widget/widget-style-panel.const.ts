export const widgetStylePanel = `
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
`;
