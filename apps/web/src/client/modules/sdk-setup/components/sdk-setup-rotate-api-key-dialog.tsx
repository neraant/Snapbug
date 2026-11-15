import { Button } from "@workspace/design-system/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/design-system/components/ui/dialog";
import { RefreshCwIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useRotateProjectApiKey } from "@/client/modules/sdk-setup/hooks/use-rotate-project-api-key";
import { SecretRevealDialog } from "@/client/modules/shared/components/secret-reveal-dialog";

type SdkSetupRotateApiKeyDialogProps = {
  projectId: string;
};

export function SdkSetupRotateApiKeyDialog({ projectId }: SdkSetupRotateApiKeyDialogProps) {
  const { isPending, onConfirm, onOpenChange, open, revealedKey } = useRotateProjectApiKey(projectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={revealedKey != null}>
      <DialogTrigger render={<Button type="button" variant="muted" size="sm" />}>
        <RefreshCwIcon />
        {texts.apiKey.rotate}
      </DialogTrigger>
      <DialogContent showClose={revealedKey == null}>
        {revealedKey ? (
          <SecretRevealDialog secret={revealedKey} kind="apiKey" onDone={() => onOpenChange(false)} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{texts.apiKey.rotateTitle}</DialogTitle>
              <DialogDescription>{texts.apiKey.rotateDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>{texts.apiKey.cancel}</DialogClose>
              <Button
                type="button"
                disabled={isPending}
                onClick={() => {
                  onConfirm().catch(() => undefined);
                }}
              >
                {texts.apiKey.confirm}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
