import { snapbug, type WidgetPreviewCapture } from "@neraant/snapbug";
import { useEffect, useRef, useState } from "react";

import type { SnapbugWidgetInitOptions } from "@/client/modules/sdk-setup/utils/build-snapbug-widget-init-options.util";

const playgroundLocalApiKey = "sb_playground_local";

export function usePlaygroundWidget(widgetOptions: SnapbugWidgetInitOptions) {
  const [capture, setCapture] = useState<WidgetPreviewCapture | null>(null);
  const screenshotUrl = useRef<string | null>(null);

  useEffect(() => {
    const preview = (next: WidgetPreviewCapture) => {
      if (screenshotUrl.current && screenshotUrl.current !== next.screenshotUrl) {
        URL.revokeObjectURL(screenshotUrl.current);
      }
      screenshotUrl.current = next.screenshotUrl;
      setCapture(next);
    };

    snapbug.init({
      apiKey: playgroundLocalApiKey,
      host: window.location.origin,
      ...widgetOptions,
      preview,
    });

    return () => {
      snapbug.destroy();
      if (screenshotUrl.current) {
        URL.revokeObjectURL(screenshotUrl.current);
        screenshotUrl.current = null;
      }
    };
  }, [widgetOptions]);

  return capture;
}
