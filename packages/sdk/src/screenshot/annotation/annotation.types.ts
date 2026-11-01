export type RectShape = { type: "rect"; x: number; y: number; w: number; h: number };
export type ArrowShape = { type: "arrow"; x1: number; y1: number; x2: number; y2: number };
export type Shape = RectShape | ArrowShape;
export type Tool = "rect" | "arrow";

export type FittedRect = {
  x: number;
  y: number;
  scale: number;
};

export type Drag =
  | { kind: "create"; tool: Tool; startX: number; startY: number }
  | { kind: "move"; index: number; origin: Shape; startX: number; startY: number };

export type ScreenshotAnnotationLabels = {
  rectangle: string;
  arrow: string;
  enlarge: string;
  close: string;
  clear: string;
};

export type MountScreenshotAnnotationOptions = {
  getBlob: () => Blob | null;
  setBlob: (blob: Blob) => void;
  onPreviewUrl: (blob: Blob) => void;
  labels: ScreenshotAnnotationLabels;
};

export type ScreenshotAnnotationController = {
  unmount: () => void;
  open: () => void;
  flush: () => Promise<void>;
};

export type AnnotationPoint = { x: number; y: number };

export type AnnotationRuntime = {
  wrap: HTMLElement;
  img: HTMLImageElement;
  options: MountScreenshotAnnotationOptions;
  canvas: HTMLCanvasElement;
  toolbar: HTMLDivElement;
  rectangleButton: HTMLButtonElement;
  arrowButton: HTMLButtonElement;
  enlargeButton: HTMLButtonElement;
  clearButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  overlay: HTMLDivElement;
  stage: HTMLDivElement;
  enlarged: HTMLImageElement;
  originalBlob: Blob | null;
  resizeObserver: ResizeObserver;
  onResize: () => void;
  onEscape: (event: KeyboardEvent) => void;
  surface: HTMLImageElement;
  tool: Tool;
  shapes: Shape[];
  draft: Shape | null;
  drag: Drag | null;
  unmounted: boolean;
  bakeGeneration: number;
  flattenTail: Promise<void>;
};
