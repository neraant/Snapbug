import { HIT_SLOP_PX, MIN_DRAG_PX } from "./annotation.const";
import type { AnnotationPoint, ArrowShape, Shape, Tool } from "./annotation.types";

export function shapeBetween(tool: Tool, x1: number, y1: number, x2: number, y2: number): Shape {
  if (tool === "rect") return { type: "rect", x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  return { type: "arrow", x1, y1, x2, y2 };
}

export function cloneShape(shape: Shape): Shape {
  if (shape.type === "rect") return { type: "rect", x: shape.x, y: shape.y, w: shape.w, h: shape.h };
  return { type: "arrow", x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 };
}

export function normalizeShape(shape: Shape): Shape {
  if (shape.type === "arrow") return shape;
  return {
    type: "rect",
    x: shape.w < 0 ? shape.x + shape.w : shape.x,
    y: shape.h < 0 ? shape.y + shape.h : shape.y,
    w: Math.abs(shape.w),
    h: Math.abs(shape.h),
  };
}

export function translateShape(shape: Shape, dx: number, dy: number): Shape {
  if (shape.type === "rect") return { type: "rect", x: shape.x + dx, y: shape.y + dy, w: shape.w, h: shape.h };
  return { type: "arrow", x1: shape.x1 + dx, y1: shape.y1 + dy, x2: shape.x2 + dx, y2: shape.y2 + dy };
}

export function isLargeEnough(shape: Shape, scale: number): boolean {
  if (shape.type === "rect") {
    return Math.abs(shape.w) * scale >= MIN_DRAG_PX || Math.abs(shape.h) * scale >= MIN_DRAG_PX;
  }
  return Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1) * scale >= MIN_DRAG_PX;
}

export function distanceToSegment(point: AnnotationPoint, shape: ArrowShape): number {
  const dx = shape.x2 - shape.x1;
  const dy = shape.y2 - shape.y1;
  const lengthSquared = dx * dx + dy * dy;
  const t =
    lengthSquared === 0 ? 0 : clamp(((point.x - shape.x1) * dx + (point.y - shape.y1) * dy) / lengthSquared, 0, 1);
  const x = shape.x1 + t * dx;
  const y = shape.y1 + t * dy;
  return Math.hypot(point.x - x, point.y - y);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hitTestShape(shapes: readonly Shape[], point: AnnotationPoint, scale: number): number {
  const slop = HIT_SLOP_PX / scale;
  for (let index = shapes.length - 1; index >= 0; index -= 1) {
    const shape = shapes[index];
    if (!shape) continue;
    if (shape.type === "rect") {
      const left = shape.x - slop;
      const top = shape.y - slop;
      const right = shape.x + shape.w + slop;
      const bottom = shape.y + shape.h + slop;
      if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom) return index;
      continue;
    }
    if (distanceToSegment(point, shape) <= slop) return index;
  }
  return -1;
}
