import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { useRef, useState } from "react";

import { useRotateProjectApiKey as useRotateProjectApiKeyMutation } from "@/client/modules/shared/queries/use-rotate-project-api-key";

export function useRotateProjectApiKey(projectId: string) {
  const [open, setOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const { copied, copy } = useCopyText();
  const { mutateAsync: rotateProjectApiKey, isPending } = useRotateProjectApiKeyMutation();

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && pendingRef.current) return;

    setOpen(nextOpen);
    if (!nextOpen) {
      setRevealedKey(null);
    }
  };

  const onConfirm = async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    try {
      const result = await rotateProjectApiKey({ projectId });
      setOpen(true);
      setRevealedKey(result.key);
    } finally {
      pendingRef.current = false;
    }
  };

  const onCopy = async () => {
    if (!revealedKey) return;
    await copy(revealedKey);
  };

  return {
    copied,
    isPending,
    onConfirm,
    onCopy,
    onOpenChange,
    open: open && revealedKey != null,
    revealedKey,
  };
}
