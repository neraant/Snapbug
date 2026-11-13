import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
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
import { Typography } from "@workspace/design-system/components/ui/typography";
import { RefreshCwIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useRotateProjectApiKey } from "@/client/modules/sdk-setup/hooks/use-rotate-project-api-key";

type SdkSetupRotateApiKeyDialogProps = {
  projectId: string;
};

export function SdkSetupRotateApiKeyDialog({ projectId }: SdkSetupRotateApiKeyDialogProps) {
  const { copied, isPending, onConfirm, onCopy, onOpenChange, open, revealedKey } = useRotateProjectApiKey(projectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button type="button" variant="muted" size="sm" />}>
        <RefreshCwIcon />
        {texts.apiKey.rotate}
      </DialogTrigger>
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
