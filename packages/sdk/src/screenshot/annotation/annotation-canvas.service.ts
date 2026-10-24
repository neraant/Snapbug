import { DISPLAY_STROKE_WIDTH } from "./annotation.const";
import type { AnnotationRuntime } from "./annotation.types";
import { strokeShape } from "./annotation-draw.util";
import { fittedAnnotationRect } from "./annotation-fit.util";

export function syncAnnotationPressed(runtime: AnnotationRuntime) {
  runtime.rectangleButton.setAttribute("aria-pressed", runtime.tool === "rect" ? "true" : "false");
  runtime.arrowButton.setAttribute("aria-pressed", runtime.tool === "arrow" ? "true" : "false");
}

export function resizeAnnotationCanvas(runtime: AnnotationRuntime) {
  const width = runtime.surface.clientWidth;
  const height = runtime.surface.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  runtime.canvas.width = Math.max(1, Math.round(width * dpr));
  runtime.canvas.height = Math.max(1, Math.round(height * dpr));
  redrawAnnotation(runtime);
}

export function redrawAnnotation(runtime: AnnotationRuntime) {
  const ctx = runtime.canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, runtime.surface.clientWidth, runtime.surface.clientHeight);

  const fitted = fittedAnnotationRect(runtime.surface);
  if (!fitted) return;

  const visible = runtime.draft ? [...runtime.shapes, runtime.draft] : runtime.shapes;
  for (const shape of visible) {
    strokeShape(
      ctx,
      shape,
      (x, y) => ({
        x: fitted.x + x * fitted.scale,
        y: fitted.y + y * fitted.scale,
      }),
      DISPLAY_STROKE_WIDTH,
    );
  }
}
