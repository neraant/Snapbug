import { BUTTON_ATTR, PANEL_ATTR } from "../widget/widget-attribute.const";

function widgetRoots(): HTMLElement[] {
  const nodes = document.querySelectorAll<HTMLElement>(`[${BUTTON_ATTR}], [${PANEL_ATTR}]`);
  return [...nodes];
}

function waitAnimationFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

export async function capturePageScreenshot(): Promise<Blob> {
  const roots = widgetRoots();
  for (const root of roots) {
    root.hidden = true;
  }

  try {
    await waitAnimationFrames(2);
    const { domToBlob } = await import("modern-screenshot");
    const blob = await domToBlob(document.documentElement, { type: "image/png" });
    if (!(blob instanceof Blob)) {
      throw new Error("Screenshot capture failed");
    }
    return blob;
  } finally {
    for (const root of roots) {
      root.hidden = false;
    }
  }
}
