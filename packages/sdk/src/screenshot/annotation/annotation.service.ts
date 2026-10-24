import type {
  AnnotationRuntime,
  MountScreenshotAnnotationOptions,
  ScreenshotAnnotationController,
} from "./annotation.types";
import { redrawAnnotation, resizeAnnotationCanvas, syncAnnotationPressed } from "./annotation-canvas.service";
import { closeAnnotationOverlay, onAnnotationEscape, openAnnotationOverlay } from "./annotation-overlay.service";
import {
  finishAnnotationDrag,
  handleAnnotationPointerDown,
  handleAnnotationPointerMove,
  handleAnnotationPointerUp,
} from "./annotation-pointer.service";
import { createAnnotationToolbar } from "./annotation-toolbar.factory";

export function mountScreenshotAnnotation(
  wrap: HTMLElement,
  img: HTMLImageElement,
  options: MountScreenshotAnnotationOptions,
): ScreenshotAnnotationController {
  const runtime = createAnnotationRuntime(wrap, img, options);
  wireAnnotation(runtime);
  return {
    unmount: () => unmountAnnotation(runtime),
    flush: () => flushAnnotation(runtime),
  };
}

function createAnnotationRuntime(
  wrap: HTMLElement,
  img: HTMLImageElement,
  options: MountScreenshotAnnotationOptions,
): AnnotationRuntime {
  const toolbar = createAnnotationToolbar(options.labels);
  const canvas = document.createElement("canvas");
  const overlay = document.createElement("div");
  const stage = document.createElement("div");
  const enlarged = document.createElement("img");

  canvas.className = "snapbug-screenshot-annotation";
  stage.className = "snapbug-annotation-stage";
  enlarged.className = "snapbug-annotation-enlarged";
  enlarged.alt = "";

  const runtime: AnnotationRuntime = {
    wrap,
    img,
    options,
    canvas,
    overlay,
    stage,
    enlarged,
    originalBlob: options.getBlob(),
    surface: img,
    tool: "rect",
    shapes: [],
    draft: null,
    drag: null,
    unmounted: false,
    bakeGeneration: 0,
    flattenTail: Promise.resolve(),
    resizeObserver: null as unknown as ResizeObserver,
    onResize: () => undefined,
    onEscape: () => undefined,
    ...toolbar,
  };

  runtime.resizeObserver = new ResizeObserver(() => {
    resizeAnnotationCanvas(runtime);
  });
  runtime.onResize = () => {
    resizeAnnotationCanvas(runtime);
  };
  runtime.onEscape = (event: KeyboardEvent) => {
    onAnnotationEscape(runtime, event);
  };
  return runtime;
}

function wireAnnotation(runtime: AnnotationRuntime) {
  syncAnnotationPressed(runtime);
  runtime.toolbar.append(runtime.rectangleButton, runtime.arrowButton, runtime.enlargeButton, runtime.clearButton);
  runtime.wrap.append(runtime.canvas, runtime.toolbar);
  bindAnnotationTools(runtime);
  bindAnnotationPointer(runtime);
  bindAnnotationChrome(runtime);
  runtime.resizeObserver.observe(runtime.img);
  runtime.img.addEventListener("load", runtime.onResize);
  if (runtime.img.complete) resizeAnnotationCanvas(runtime);
}

function bindAnnotationTools(runtime: AnnotationRuntime) {
  runtime.rectangleButton.addEventListener("click", () => {
    runtime.tool = "rect";
    syncAnnotationPressed(runtime);
  });
  runtime.arrowButton.addEventListener("click", () => {
    runtime.tool = "arrow";
    syncAnnotationPressed(runtime);
  });
  runtime.clearButton.addEventListener("click", () => {
    clearAnnotationShapes(runtime);
  });
}

function bindAnnotationPointer(runtime: AnnotationRuntime) {
  runtime.canvas.addEventListener("pointerdown", (event) => {
    handleAnnotationPointerDown(runtime, event);
  });
  runtime.canvas.addEventListener("pointermove", (event) => {
    handleAnnotationPointerMove(runtime, event);
  });
  runtime.canvas.addEventListener("pointerup", (event) => {
    handleAnnotationPointerUp(runtime, event);
  });
  runtime.canvas.addEventListener("pointercancel", (event) => {
    handleAnnotationPointerUp(runtime, event);
  });
}

function bindAnnotationChrome(runtime: AnnotationRuntime) {
  runtime.enlargeButton.addEventListener("click", () => {
    openAnnotationOverlay(runtime);
  });
  runtime.closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeAnnotationOverlay(runtime);
  });
  runtime.overlay.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  runtime.overlay.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.target === runtime.overlay) closeAnnotationOverlay(runtime);
  });
  document.addEventListener("keydown", runtime.onEscape, true);
}

function clearAnnotationShapes(runtime: AnnotationRuntime) {
  runtime.shapes = [];
  runtime.draft = null;
  runtime.drag = null;
  runtime.bakeGeneration += 1;
  redrawAnnotation(runtime);
  if (!runtime.originalBlob) return;
  runtime.options.setBlob(runtime.originalBlob);
  runtime.options.onPreviewUrl(runtime.originalBlob);
  if (runtime.overlay.isConnected) runtime.enlarged.src = runtime.img.src;
}

async function flushAnnotation(runtime: AnnotationRuntime) {
  finishAnnotationDrag(runtime);
  await runtime.flattenTail;
}

function unmountAnnotation(runtime: AnnotationRuntime) {
  runtime.unmounted = true;
  runtime.bakeGeneration += 1;
  closeAnnotationOverlay(runtime);
  runtime.resizeObserver.disconnect();
  document.removeEventListener("keydown", runtime.onEscape, true);
  runtime.img.removeEventListener("load", runtime.onResize);
  runtime.canvas.remove();
  runtime.toolbar.remove();
}
