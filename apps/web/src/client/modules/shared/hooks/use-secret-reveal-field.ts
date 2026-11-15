import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { useCallback, useState } from "react";

export function useSecretRevealField(secret: string) {
  const [revealed, setRevealed] = useState(false);
  const [hasCopiedOnce, setHasCopiedOnce] = useState(false);
  const { copied, copy } = useCopyText({ resetAfterMs: 2000 });

  const onCopy = useCallback(async () => {
    await copy(secret);
    setHasCopiedOnce(true);
  }, [copy, secret]);

  const onToggleReveal = useCallback(() => {
    setRevealed((current) => !current);
  }, []);

  return {
    copied,
    hasCopiedOnce,
    onCopy,
    onToggleReveal,
    revealed,
  };
}
