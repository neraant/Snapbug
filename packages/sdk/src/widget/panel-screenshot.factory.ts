import { mountScreenshotAnnotation } from "../screenshot/annotation/annotation.service";
import { capturePageScreenshot } from "../screenshot/screenshot-capture.service";
import type { PanelSession } from "./panel.types";
import { showPanelError } from "./panel-view.factory";
import { COPY } from "./widget-copy.const";

export function bindPanelScreenshot(session: PanelSession) {
  session.captureScreenshot.addEventListener("click", async () => {
    await capturePanelScreenshot(session);
  });
  session.removeScreenshot.addEventListener("click", () => {
    clearPanelScreenshot(session);
  });
}

export function clearPanelScreenshot(session: PanelSession) {
  session.annotation?.unmount();
  session.annotation = null;
  revokeScreenshotPreview(session);
  session.screenshotBlob = null;
  session.screenshotPreview.removeAttribute("src");
  session.screenshotPreviewWrap.hidden = true;
  session.removeScreenshot.hidden = true;
}

async function capturePanelScreenshot(session: PanelSession) {
  session.captureScreenshot.disabled = true;
  const previousLabel = session.captureScreenshot.textContent;
  session.captureScreenshot.textContent = COPY.capturingScreenshot;

  try {
    const blob = await capturePageScreenshot();
    setScreenshotPreview(session, blob);
  } catch {
    showPanelError(session, COPY.errorMessage);
  } finally {
    session.captureScreenshot.disabled = false;
    session.captureScreenshot.textContent = previousLabel ?? COPY.captureScreenshot;
  }
}

function setScreenshotPreview(session: PanelSession, blob: Blob) {
  session.annotation?.unmount();
  session.annotation = null;
  revokeScreenshotPreview(session);
  session.screenshotBlob = blob;
  session.screenshotPreviewUrl = URL.createObjectURL(blob);
  session.screenshotPreview.src = session.screenshotPreviewUrl;
  session.screenshotPreviewWrap.hidden = false;
  session.removeScreenshot.hidden = false;
  session.annotation = mountScreenshotAnnotation(session.screenshotPreviewWrap, session.screenshotPreview, {
    getBlob: () => session.screenshotBlob,
    setBlob: (next) => {
      session.screenshotBlob = next;
    },
    onPreviewUrl: (next) => {
      revokeScreenshotPreview(session);
      session.screenshotPreviewUrl = URL.createObjectURL(next);
      session.screenshotPreview.src = session.screenshotPreviewUrl;
    },
    labels: {
      rectangle: COPY.annotateRectangle,
      arrow: COPY.annotateArrow,
      enlarge: COPY.annotateEnlarge,
      close: COPY.annotateClose,
      clear: COPY.annotateClear,
    },
  });
}

function revokeScreenshotPreview(session: PanelSession) {
  if (!session.screenshotPreviewUrl) return;
  URL.revokeObjectURL(session.screenshotPreviewUrl);
  session.screenshotPreviewUrl = null;
}
