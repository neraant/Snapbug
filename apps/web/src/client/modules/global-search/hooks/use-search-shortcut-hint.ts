import { useEffect, useState } from "react";

import { texts } from "@/client/modules/global-search/consts/texts.const";

export function useSearchShortcutHint(): string {
  const [hint, setHint] = useState<string>(texts.shortcutMac);

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    setHint(isApple ? texts.shortcutMac : texts.shortcutWindows);
  }, []);

  return hint;
}
