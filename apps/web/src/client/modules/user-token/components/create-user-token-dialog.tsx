import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/design-system/components/ui/dialog";

import { texts } from "@/client/modules/user-token/consts/texts.const";
import { useCreateUserTokenDialog } from "@/client/modules/user-token/hooks/use-create-user-token-dialog";

export function CreateUserTokenDialog() {
  const { secret, open, isPending, onCreate, onOpenChange } = useCreateUserTokenDialog();

  return (
    <>
      <Button type="button" onClick={onCreate} disabled={isPending}>
        {texts.create.action}
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{texts.secret.title}</DialogTitle>
            <DialogDescription>{texts.secret.description}</DialogDescription>
          </DialogHeader>
          {secret ? <Code code={secret} copyLabel={texts.secret.copy} copiedLabel={texts.secret.copied} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
