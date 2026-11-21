import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { Dialog, DialogContent } from "@workspace/design-system/components/ui/dialog";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { RefreshCwIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useRotateProjectApiKey } from "@/client/modules/sdk-setup/hooks/use-rotate-project-api-key";
import { SecretRevealDialog } from "@/client/modules/shared/components/secret-reveal-dialog";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";

type SdkSetupRotateApiKeyDialogProps = {
  projectId: string;
};

export function SdkSetupRotateApiKeyDialog({ projectId }: SdkSetupRotateApiKeyDialogProps) {
  const { onConfirm, onOpenChange, open, revealedKey } = useRotateProjectApiKey(projectId);
  const { confirm, bind } = useConfirmDialog();

  const openRotateConfirm = () => {
    confirm({
      title: texts.apiKey.rotateTitle,
      description: texts.apiKey.rotateDescription,
      confirmLabel: texts.apiKey.confirm,
      variant: "destructive",
      errorFallback: texts.apiKey.rotateError,
      onConfirm: async () => {
        try {
          await onConfirm();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.apiKey.rotateError));
        }
      },
    });
  };

  return (
    <>
      <Button type="button" variant="muted" size="sm" onClick={openRotateConfirm}>
        <RefreshCwIcon />
        {texts.apiKey.rotate}
      </Button>
      <ConfirmDialog {...bind()} />
      <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={revealedKey != null}>
        <DialogContent showClose={false}>
          {revealedKey ? (
            <SecretRevealDialog secret={revealedKey} kind="apiKey" onDone={() => onOpenChange(false)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
