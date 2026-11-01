import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { useState } from "react";

import { texts } from "@/client/modules/error/consts/texts.const";

type UseErrorDetailsParams = {
  error: Error & { digest?: string };
};

export function useErrorDetails({ error }: UseErrorDetailsParams) {
  const { copied, copy } = useCopyText();
  const [details] = useState(() => ({
    errorId: error.digest,
    timestamp: new Date().toISOString(),
    message: error.message,
  }));

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
