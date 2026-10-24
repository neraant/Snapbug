import { DISPLAY_STROKE_WIDTH } from "./annotation.const";
import type { AnnotationRuntime } from "./annotation.types";
import { strokeShape } from "./annotation-draw.util";
import { fittedAnnotationRect } from "./annotation-fit.util";
import { cloneShape } from "./annotation-shape.util";

export function scheduleAnnotationFlatten(runtime: AnnotationRuntime): Promise<void> {
  const run = bakeAnnotation(runtime);
  runtime.flattenTail = runtime.flattenTail.then(
    () => run,
    () => run,
  );
  return runtime.flattenTail;
}

export async function bakeAnnotation(runtime: AnnotationRuntime) {
  const generation = ++runtime.bakeGeneration;
  const snapshot = runtime.shapes.map(cloneShape);
  if (snapshot.length === 0) {
    if (runtime.originalBlob) runtime.options.setBlob(runtime.originalBlob);
    return;
  }

  try {
    await runtime.img.decode();
  } catch {
    return;
  }
  if (generation !== runtime.bakeGeneration || runtime.unmounted) return;
  if (runtime.img.naturalWidth === 0 || runtime.img.naturalHeight === 0) return;

  const blob = await renderAnnotationBlob(runtime, snapshot);
  if (!blob || generation !== runtime.bakeGeneration || runtime.unmounted) return;
  runtime.options.setBlob(blob);
}

async function renderAnnotationBlob(runtime: AnnotationRuntime, snapshot: ReturnType<typeof cloneShape>[]) {
  const fitted = fittedAnnotationRect(runtime.surface);
  const lineWidth = fitted && fitted.scale > 0 ? DISPLAY_STROKE_WIDTH / fitted.scale : DISPLAY_STROKE_WIDTH;
  const offscreen = document.createElement("canvas");
  offscreen.width = runtime.img.naturalWidth;
  offscreen.height = runtime.img.naturalHeight;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(runtime.img, 0, 0);
  for (const shape of snapshot) {
    strokeShape(ctx, shape, (x, y) => ({ x, y }), lineWidth);
  }

  return new Promise<Blob | null>((resolve) => {
    offscreen.toBlob(resolve, "image/png");
  });
}
