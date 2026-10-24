import type { AnnotationPoint, FittedRect } from "./annotation.types";
import { clamp } from "./annotation-shape.util";

export function fittedAnnotationRect(surface: HTMLImageElement): FittedRect | null {
  const naturalWidth = surface.naturalWidth;
  const naturalHeight = surface.naturalHeight;
  const elementWidth = surface.clientWidth;
  const elementHeight = surface.clientHeight;
  if (naturalWidth === 0 || naturalHeight === 0 || elementWidth === 0 || elementHeight === 0) return null;

  const scale = Math.min(elementWidth / naturalWidth, elementHeight / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  return {
    x: (elementWidth - width) / 2,
    y: (elementHeight - height) / 2,
    scale,
  };
}

export function clientToNaturalPoint(surface: HTMLImageElement, event: PointerEvent): AnnotationPoint | null {
  const fitted = fittedAnnotationRect(surface);
  if (!fitted) return null;

  const bounds = surface.getBoundingClientRect();
  const naturalX = (event.clientX - bounds.left - fitted.x) / fitted.scale;
  const naturalY = (event.clientY - bounds.top - fitted.y) / fitted.scale;
  return {
    x: clamp(naturalX, 0, surface.naturalWidth),
    y: clamp(naturalY, 0, surface.naturalHeight),
  };
}
