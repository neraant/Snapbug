import { mountScreenshotAnnotation } from "../screenshot/annotation/annotation.service";
import { capturePageScreenshot } from "../screenshot/screenshot-capture.service";
import type { PanelSession } from "./panel.types";
import { showPanelError } from "./panel-view.factory";
import { COPY } from "./widget-copy.const";

export function bindPanelScreenshot(session: PanelSession) {
  session.captureScreenshot.addEventListener("click", async () => {
    session.screenshotDeclined = false;
    await capturePanelScreenshot(session);
  });
  session.annotateScreenshot.addEventListener("click", () => {
    session.annotation?.open();
  });
  session.removeScreenshot.addEventListener("click", () => {
    clearPanelScreenshot(session);
    session.screenshotDeclined = true;
  });
}

/** Captures when the panel opens, unless a shot exists, one is in flight, or the user removed it. */
export async function autoCapturePanelScreenshot(session: PanelSession) {
  if (session.screenshotBlob || session.screenshotDeclined || session.captureScreenshot.disabled) return;
  await capturePanelScreenshot(session);
}

export function clearPanelScreenshot(session: PanelSession) {
  session.screenshotToken += 1;
  session.annotation?.unmount();
  session.annotation = null;
  revokeScreenshotPreview(session);
  session.screenshotBlob = null;
  session.screenshotPreview.removeAttribute("src");
  session.screenshotPreviewWrap.hidden = true;
  session.screenshotCaption.hidden = true;
  setCaptureButton(session, false);
}

function setCaptureButton(session: PanelSession, capturing: boolean) {
  const label = session.captureScreenshot.querySelector(".snapbug-capture-label");
  if (label) label.textContent = capturing ? COPY.capturingScreenshot : COPY.captureScreenshot;
  session.captureScreenshot.disabled = capturing;
  session.captureScreenshot.hidden = session.screenshotBlob !== null;
}

async function capturePanelScreenshot(session: PanelSession) {
  const token = ++session.screenshotToken;
  setCaptureButton(session, true);

  try {
    const blob = await capturePageScreenshot();
    if (token !== session.screenshotToken) return;
    setScreenshotPreview(session, blob);
  } catch {
    if (token !== session.screenshotToken) return;
    showPanelError(session, COPY.errorMessage);
  } finally {
    if (token === session.screenshotToken) setCaptureButton(session, false);
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
  session.screenshotCaption.hidden = false;
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
