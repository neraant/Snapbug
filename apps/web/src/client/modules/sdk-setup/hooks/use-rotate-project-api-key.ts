import { toast } from "@workspace/design-system/components/ui/toast";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRef, useState } from "react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useRotateProjectApiKey as useRotateProjectApiKeyMutation } from "@/client/modules/shared/queries/use-rotate-project-api-key";

export function useRotateProjectApiKey(projectId: string) {
  const [open, setOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const openRef = useRef(false);
  const pendingRef = useRef(false);
  const { copied, copy } = useCopyText();
  const { mutateAsync: rotateProjectApiKey, isPending } = useRotateProjectApiKeyMutation();

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && pendingRef.current) return;

    openRef.current = nextOpen;
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
      openRef.current = true;
      setOpen(true);
      setRevealedKey(result.key);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.apiKey.rotateError),
        type: "error",
      });
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
    open,
    revealedKey,
  };
}
