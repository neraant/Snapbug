export const widgetStyleBase = `
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
  font-family: var(--snapbug-font, Inter, system-ui, -apple-system, sans-serif);
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

.snapbug.snapbug-theme-light {
  --primary-foreground: oklch(1 0 0);
  --card: oklch(1 0 0);
  --foreground: oklch(0.215 0.006 56);
  --muted-foreground: oklch(0.553 0.012 56);
  --destructive: oklch(0.627 0.222 25.5);
  --success: oklch(0.704 0.165 158);
  --border: oklch(0.92 0.005 60);
}

.snapbug.snapbug-theme-dark {
  --primary-foreground: oklch(0.185 0.006 50);
  --card: oklch(0.215 0.006 56);
  --foreground: oklch(0.965 0.003 75);
  --muted-foreground: oklch(0.695 0.008 60);
  --destructive: oklch(0.68 0.215 25);
  --success: oklch(0.745 0.16 158);
  --border: oklch(0.268 0.006 56);
}

.snapbug.snapbug-position-left.snapbug-trigger,
.snapbug.snapbug-position-left.snapbug-panel {
  left: 24px;
  right: auto;
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

@media (max-width: 639px) {
  .snapbug.snapbug-trigger.snapbug-trigger-above-sheet {
    bottom: calc(90vh + 10px);
  }
}
`;
