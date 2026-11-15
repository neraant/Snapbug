import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/design-system/components/ui/dialog";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { RefreshCwIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useRotateProjectApiKey } from "@/client/modules/sdk-setup/hooks/use-rotate-project-api-key";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";

type SdkSetupRotateApiKeyDialogProps = {
  projectId: string;
};

export function SdkSetupRotateApiKeyDialog({ projectId }: SdkSetupRotateApiKeyDialogProps) {
  const { copied, onConfirm, onCopy, onOpenChange, open, revealedKey } = useRotateProjectApiKey(projectId);
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {revealedKey ? (
            <>
              <DialogHeader>
                <DialogTitle>{texts.apiKey.revealedTitle}</DialogTitle>
                <DialogDescription>{texts.apiKey.revealedDescription}</DialogDescription>
              </DialogHeader>
              <Typography variant="label">{texts.apiKey.label}</Typography>
              <Code code={revealedKey} showCopy={false} />
              <DialogFooter>
                <CopyButton
                  copied={copied}
                  onCopy={() => {
                    onCopy().catch(() => undefined);
                  }}
                  copyLabel={texts.apiKey.copy}
                  copiedLabel={texts.apiKey.copied}
                />
                <DialogClose render={<Button type="button" variant="outline" />}>{texts.apiKey.close}</DialogClose>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
