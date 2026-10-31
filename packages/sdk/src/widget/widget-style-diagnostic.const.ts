export const widgetStyleDiagnostic = `
.snapbug .snapbug-diagnostic {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: color-mix(in oklch, var(--foreground) 4%, var(--card));
}

.snapbug .snapbug-diagnostic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 4px;
  min-width: 0;
}

.snapbug .snapbug-diagnostic-heading {
  margin: 0;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 600;
}

.snapbug .snapbug-diagnostic-counter {
  color: var(--muted-foreground);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.snapbug .snapbug-diagnostic-list {
  display: flex;
  flex-direction: column;
}

.snapbug .snapbug-diagnostic-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  min-width: 0;
}

.snapbug .snapbug-diagnostic-row + .snapbug-diagnostic-row {
  border-top: 1px solid var(--border);
}

.snapbug .snapbug-diagnostic-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.snapbug .snapbug-diagnostic-title-line {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.snapbug .snapbug-diagnostic-title {
  color: var(--foreground);
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
  flex: 1;
  min-width: 0;
}

.snapbug .snapbug-diagnostic-description {
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.snapbug .snapbug-tooltip {
  position: relative;
  display: inline-flex;
  flex: none;
  color: var(--muted-foreground);
  cursor: help;
  border-radius: 999px;
}

.snapbug .snapbug-tooltip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-tooltip svg {
  display: block;
  width: 14px;
  height: 14px;
}

.snapbug .snapbug-tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  z-index: 4;
  box-sizing: border-box;
  width: min(220px, calc(100vw - 32px));
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-lg);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: anywhere;
  display: none;
}

.snapbug .snapbug-tooltip:hover .snapbug-tooltip-bubble,
.snapbug .snapbug-tooltip:focus-visible .snapbug-tooltip-bubble {
  display: block;
}

.snapbug .snapbug-switch {
  position: relative;
  flex: none;
  width: 36px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in oklch, var(--foreground) 14%, var(--card));
  cursor: pointer;
  transition: background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

.snapbug .snapbug-switch[aria-checked="true"] {
  border-color: var(--primary);
  background: color-mix(in oklab, var(--primary) 85%, var(--card));
}

.snapbug .snapbug-switch:focus-visible {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-switch-thumb {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: var(--card);
  box-shadow: var(--shadow-md);
  transition: transform 200ms ease;
}

.snapbug .snapbug-switch[aria-checked="true"] .snapbug-switch-thumb {
  transform: translateX(16px);
}

@media (prefers-reduced-motion: reduce) {
  .snapbug .snapbug-switch,
  .snapbug .snapbug-switch-thumb,
  .snapbug .snapbug-severity-card {
    transition: none;
  }
}
`;
