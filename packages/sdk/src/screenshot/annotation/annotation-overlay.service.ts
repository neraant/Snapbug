import type { AnnotationRuntime } from "./annotation.types";
import { resizeAnnotationCanvas } from "./annotation-canvas.service";

export function openAnnotationOverlay(runtime: AnnotationRuntime) {
  if (runtime.overlay.isConnected || runtime.unmounted) return;

  const root = runtime.wrap.closest(".snapbug");
  runtime.overlay.className = "snapbug snapbug-annotation-overlay";
  copyOverlayTheme(runtime, root);

  runtime.enlarged.src = runtime.img.src;
  runtime.enlargeButton.hidden = true;
  runtime.stage.append(runtime.enlarged, runtime.canvas, runtime.toolbar);
  runtime.overlay.append(runtime.stage, runtime.closeButton);
  document.body.append(runtime.overlay);
  runtime.surface = runtime.enlarged;
  runtime.resizeObserver.observe(runtime.enlarged);
  runtime.enlarged.addEventListener("load", runtime.onResize);
  if (runtime.enlarged.complete && runtime.enlarged.naturalWidth > 0) resizeAnnotationCanvas(runtime);
  runtime.closeButton.focus();
}

export function closeAnnotationOverlay(runtime: AnnotationRuntime) {
  if (!runtime.overlay.isConnected) return;

  document.addEventListener("click", swallowOutsideClick, true);
  window.setTimeout(() => {
    document.removeEventListener("click", swallowOutsideClick, true);
  }, 0);

  runtime.enlarged.removeEventListener("load", runtime.onResize);
  runtime.resizeObserver.unobserve(runtime.enlarged);
  runtime.enlargeButton.hidden = false;
  runtime.wrap.append(runtime.canvas, runtime.toolbar);
  runtime.overlay.remove();
  runtime.surface = runtime.img;
  resizeAnnotationCanvas(runtime);
}

export function onAnnotationEscape(runtime: AnnotationRuntime, event: KeyboardEvent) {
  if (!runtime.overlay.isConnected || event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  closeAnnotationOverlay(runtime);
}

function copyOverlayTheme(runtime: AnnotationRuntime, root: Element | null) {
  if (!(root instanceof HTMLElement)) return;
  if (root.classList.contains("snapbug-theme-light")) runtime.overlay.classList.add("snapbug-theme-light");
  if (root.classList.contains("snapbug-theme-dark")) runtime.overlay.classList.add("snapbug-theme-dark");
  const primary = root.style.getPropertyValue("--primary");
  const ring = root.style.getPropertyValue("--ring");
  if (primary) runtime.overlay.style.setProperty("--primary", primary);
  if (ring) runtime.overlay.style.setProperty("--ring", ring);
}

function swallowOutsideClick(event: Event) {
  event.stopPropagation();
}
