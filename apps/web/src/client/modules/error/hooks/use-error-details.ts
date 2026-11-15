import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import {
  getAppErrorHttpStatus,
  stripRouteErrorHttpStatusFromMessage,
} from "@workspace/server/error/app-error-http-status";
import { useState } from "react";

import { texts } from "@/client/modules/error/consts/texts.const";
import { resolveErrorScreenCopy } from "@/client/modules/error/utils/resolve-error-screen-copy.util";

type UseErrorDetailsParams = {
  error: Error & { digest?: string };
};

export function useErrorDetails({ error }: UseErrorDetailsParams) {
  const { copied, copy } = useCopyText();
  const [details] = useState(() => {
    const status = getAppErrorHttpStatus(error);

    return {
      errorId: error.digest,
      timestamp: new Date().toISOString(),
      message: stripRouteErrorHttpStatusFromMessage(error.message),
      status,
      screenCopy: resolveErrorScreenCopy(status),
    };
  });

  function copyDetails() {
    const payload = [
      details.errorId ? `${texts.errorId} ${details.errorId}` : undefined,
      `${texts.timestamp} ${details.timestamp}`,
      details.message,
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    copy(payload).catch(() => undefined);
  }

  return { copied, details, copy: copyDetails };
}
