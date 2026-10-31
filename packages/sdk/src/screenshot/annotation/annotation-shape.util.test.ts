import { describe, expect, it } from "vitest";

import { hitTestShape, isLargeEnough, normalizeShape, shapeBetween, translateShape } from "./annotation-shape.util";

describe("annotation shape helpers", () => {
  it("builds and normalizes a dragged rectangle", () => {
    const raw = shapeBetween("rect", 10, 20, 4, 8);
    expect(raw).toEqual({ type: "rect", x: 10, y: 20, w: -6, h: -12 });

    expect(normalizeShape(raw)).toEqual({ type: "rect", x: 4, y: 8, w: 6, h: 12 });
  });

  it("translates shapes", () => {
    const rect = { type: "rect" as const, x: 0, y: 0, w: 5, h: 5 };
    expect(translateShape(rect, 2, 3)).toEqual({ type: "rect", x: 2, y: 3, w: 5, h: 5 });
  });

  it("requires a minimum size at scale", () => {
    expect(isLargeEnough({ type: "rect", x: 0, y: 0, w: 2, h: 1 }, 2)).toBe(true);
    expect(isLargeEnough({ type: "rect", x: 0, y: 0, w: 1, h: 0.1 }, 1)).toBe(false);
  });

  it("hit-tests the topmost shape", () => {
    const shapes = [
      { type: "rect" as const, x: 0, y: 0, w: 10, h: 10 },
      { type: "rect" as const, x: 5, y: 5, w: 10, h: 10 },
    ];
    expect(hitTestShape(shapes, { x: 6, y: 6 }, 1)).toBe(1);
    expect(hitTestShape(shapes, { x: 50, y: 50 }, 1)).toBe(-1);
  });
});
