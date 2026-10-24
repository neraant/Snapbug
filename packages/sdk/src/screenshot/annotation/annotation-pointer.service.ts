import type { AnnotationRuntime } from "./annotation.types";
import { scheduleAnnotationFlatten } from "./annotation-bake.service";
import { redrawAnnotation } from "./annotation-canvas.service";
import { clientToNaturalPoint, fittedAnnotationRect } from "./annotation-fit.util";
import { hitTestShape, isLargeEnough, normalizeShape, shapeBetween, translateShape } from "./annotation-shape.util";

export function handleAnnotationPointerDown(runtime: AnnotationRuntime, event: PointerEvent) {
  if (event.button !== 0) return;
  const point = clientToNaturalPoint(runtime.surface, event);
  const fitted = fittedAnnotationRect(runtime.surface);
  if (!point || !fitted) return;

  const hit = hitTestShape(runtime.shapes, point, fitted.scale);
  if (hit >= 0) {
    const origin = runtime.shapes[hit];
    if (!origin) return;
    runtime.drag = { kind: "move", index: hit, origin, startX: point.x, startY: point.y };
  } else {
    runtime.drag = { kind: "create", tool: runtime.tool, startX: point.x, startY: point.y };
    runtime.draft = shapeBetween(runtime.tool, point.x, point.y, point.x, point.y);
  }

  runtime.canvas.setPointerCapture(event.pointerId);
  redrawAnnotation(runtime);
}

export function handleAnnotationPointerMove(runtime: AnnotationRuntime, event: PointerEvent) {
  const point = clientToNaturalPoint(runtime.surface, event);
  const fitted = fittedAnnotationRect(runtime.surface);
  if (!point || !fitted) return;

  if (!runtime.drag) {
    runtime.canvas.style.cursor = hitTestShape(runtime.shapes, point, fitted.scale) >= 0 ? "move" : "crosshair";
    return;
  }

  if (runtime.drag.kind === "create") {
    runtime.draft = shapeBetween(runtime.drag.tool, runtime.drag.startX, runtime.drag.startY, point.x, point.y);
  } else {
    const next = translateShape(runtime.drag.origin, point.x - runtime.drag.startX, point.y - runtime.drag.startY);
    runtime.shapes[runtime.drag.index] = next;
  }
  redrawAnnotation(runtime);
}

export function handleAnnotationPointerUp(runtime: AnnotationRuntime, event: PointerEvent) {
  if (runtime.canvas.hasPointerCapture(event.pointerId)) runtime.canvas.releasePointerCapture(event.pointerId);
  finishAnnotationDrag(runtime);
}

export function finishAnnotationDrag(runtime: AnnotationRuntime) {
  if (!runtime.drag) return;

  const fitted = fittedAnnotationRect(runtime.surface);
  if (runtime.drag.kind === "create" && runtime.draft && fitted && isLargeEnough(runtime.draft, fitted.scale)) {
    runtime.shapes.push(normalizeShape(runtime.draft));
  }

  runtime.draft = null;
  runtime.drag = null;
  redrawAnnotation(runtime);
  scheduleAnnotationFlatten(runtime).catch(() => undefined);
}
