export const widgetStyleAnnotation = `
.snapbug .snapbug-screenshot-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.snapbug .snapbug-screenshot-preview-wrap {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.snapbug .snapbug-screenshot-preview {
  display: block;
  width: 100%;
  height: auto;
  max-height: 160px;
  object-fit: contain;
  background: color-mix(in oklch, var(--foreground) 4%, transparent);
}

.snapbug .snapbug-screenshot-annotation {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
}

.snapbug .snapbug-screenshot-toolbar {
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--radius) - 2px);
  background: color-mix(in oklch, var(--card) 88%, transparent);
  box-shadow: var(--shadow-md);
}

.snapbug .snapbug-screenshot-tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: calc(var(--radius) - 4px);
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
}

.snapbug .snapbug-screenshot-tool:hover {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
}

.snapbug .snapbug-screenshot-tool[aria-pressed="true"] {
  border-color: var(--border);
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
}

.snapbug .snapbug-screenshot-tool:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.snapbug .snapbug-screenshot-tool svg {
  display: block;
  width: 16px;
  height: 16px;
}

.snapbug.snapbug-annotation-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 24px 24px;
  background: rgb(0 0 0 / 0.72);
}

.snapbug .snapbug-annotation-stage {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

.snapbug .snapbug-annotation-enlarged {
  display: block;
  width: auto;
  height: auto;
  max-width: min(1100px, calc(100vw - 48px));
  max-height: calc(100vh - 96px);
  object-fit: contain;
  border-radius: var(--radius);
  background: color-mix(in oklch, var(--foreground) 4%, transparent);
}

.snapbug .snapbug-annotation-close {
  position: fixed;
  top: 16px;
  right: 16px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-md);
}

.snapbug .snapbug-screenshot-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.snapbug .snapbug-screenshot-caption-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted-foreground);
  font-size: 13px;
}

.snapbug .snapbug-screenshot-caption-text svg {
  width: 14px;
  height: 14px;
  color: var(--primary);
}

.snapbug .snapbug-screenshot-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.snapbug .snapbug-annotate {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
}

.snapbug .snapbug-capture {
  gap: 8px;
  align-self: flex-start;
}

.snapbug .snapbug-capture svg {
  width: 16px;
  height: 16px;
}

.snapbug .snapbug-capture:disabled {
  opacity: 0.6;
  cursor: progress;
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
