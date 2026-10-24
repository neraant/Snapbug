import { STROKE_COLOR } from "./annotation.const";
import type { Shape } from "./annotation.types";

export function strokeShape(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  map: (x: number, y: number) => { x: number; y: number },
  lineWidth: number,
) {
  ctx.strokeStyle = STROKE_COLOR;
  ctx.fillStyle = STROKE_COLOR;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (shape.type === "rect") {
    const start = map(shape.x, shape.y);
    const end = map(shape.x + shape.w, shape.y + shape.h);
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    return;
  }

  strokeArrow(ctx, map(shape.x1, shape.y1), map(shape.x2, shape.y2), lineWidth);
}

function strokeArrow(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  lineWidth: number,
) {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  if (length < 1) return;

  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = Math.min(lineWidth * 5, length * 0.45);
  const wing = Math.PI / 7;
  const shaftEnd = head * Math.cos(wing);
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x - Math.cos(angle) * shaftEnd, end.y - Math.sin(angle) * shaftEnd);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - head * Math.cos(angle - wing), end.y - head * Math.sin(angle - wing));
  ctx.lineTo(end.x - head * Math.cos(angle + wing), end.y - head * Math.sin(angle + wing));
  ctx.closePath();
  ctx.fill();
}
