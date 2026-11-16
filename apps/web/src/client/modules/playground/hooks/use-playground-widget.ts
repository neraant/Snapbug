import { snapbug, type WidgetPreviewCapture } from "@neraant/snapbug";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { type PlaygroundStep,playgroundSteps } from "@/client/modules/playground/consts/playground-step.const";
import type { SnapbugWidgetInitOptions } from "@/client/modules/sdk-setup/utils/build-snapbug-widget-init-options.util";

const playgroundLocalApiKey = "sb_playground_local";
const widgetButtonSelector = "[data-snapbug-button]";
const widgetPanelSelector = "[data-snapbug-panel]";

type UsePlaygroundWidgetOptions = {
  widgetOptions: SnapbugWidgetInitOptions;
  frameRef: RefObject<HTMLDivElement | null>;
};

export type PlaygroundWidgetState = {
  capture: WidgetPreviewCapture | null;
  isPending: boolean;
  error: string | null;
  step: PlaygroundStep;
  reset: () => void;
  openWidget: () => void;
  retry: () => void;
};

export function usePlaygroundWidget({ widgetOptions, frameRef }: UsePlaygroundWidgetOptions): PlaygroundWidgetState {
  const [capture, setCapture] = useState<WidgetPreviewCapture | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<PlaygroundStep>(playgroundSteps.interact);
  const [initKey, setInitKey] = useState(0);
  const screenshotUrl = useRef<string | null>(null);

  const reset = useCallback(() => {
    snapbug.destroy();
    if (screenshotUrl.current) {
      URL.revokeObjectURL(screenshotUrl.current);
      screenshotUrl.current = null;
    }
    setCapture(null);
    setIsPending(false);
    setError(null);
    setStep(playgroundSteps.interact);
    setInitKey((value) => value + 1);
  }, []);

  const openWidget = useCallback(() => {
    snapbug.open();
    setStep((current) => (current < playgroundSteps.report ? playgroundSteps.report : current));
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setIsPending(false);
    openWidget();
  }, [openWidget]);

  const attachWidgetToFrame = useCallback(() => {
    const frame = frameRef.current;
    const button = document.querySelector(widgetButtonSelector);
    if (!(frame instanceof HTMLElement) || !(button instanceof HTMLElement)) return;

    frame.append(button);
    button.style.position = "absolute";
    button.style.right = "16px";
    button.style.bottom = "16px";
    button.style.left = "auto";
    button.style.zIndex = "10";
  }, [frameRef]);

  useEffect(() => {
    const preview = (next: WidgetPreviewCapture) => {
      try {
        if (screenshotUrl.current && screenshotUrl.current !== next.screenshotUrl) {
          URL.revokeObjectURL(screenshotUrl.current);
        }
        screenshotUrl.current = next.screenshotUrl;
        setCapture(next);
        setIsPending(false);
        setError(null);
        setStep(playgroundSteps.review);
      } catch {
        setIsPending(false);
        setError("capture-failed");
      }
    };

    snapbug.init({
      apiKey: playgroundLocalApiKey,
      host: window.location.origin,
      ...widgetOptions,
      preview,
    }).catch(() => {
      setError("capture-failed");
    });

    const frameTimer = window.setTimeout(attachWidgetToFrame, 0);

    return () => {
      window.clearTimeout(frameTimer);
      snapbug.destroy();
      if (screenshotUrl.current) {
        URL.revokeObjectURL(screenshotUrl.current);
        screenshotUrl.current = null;
      }
    };
  }, [attachWidgetToFrame, initKey, widgetOptions]);

  useEffect(() => {
    const onWidgetSubmit = (event: Event) => {
      const target = event.target;
      const panel = document.querySelector(widgetPanelSelector);
      if (!(target instanceof HTMLFormElement) || !panel?.contains(target)) return;

      setIsPending(true);
      setError(null);
      setStep(playgroundSteps.report);
    };

    document.addEventListener("submit", onWidgetSubmit, true);

    return () => {
      document.removeEventListener("submit", onWidgetSubmit, true);
    };
  }, [initKey]);

  useEffect(() => {
    const panel = document.querySelector(widgetPanelSelector);
    if (!(panel instanceof HTMLElement)) return;

    const observer = new MutationObserver(() => {
      if (panel.classList.contains("snapbug-open")) {
        setStep((current) => (current < playgroundSteps.report ? playgroundSteps.report : current));
      }
    });

    observer.observe(panel, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, [initKey]);

  return {
    capture,
    isPending,
    error,
    step,
    reset,
    openWidget,
    retry,
  };
}