import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/design-system/components/ui/dialog";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";

import { texts } from "@/client/modules/user-token/consts/texts.const";
import { useCreateUserTokenDialog } from "@/client/modules/user-token/hooks/use-create-user-token-dialog";

export function CreateUserTokenDialog() {
  const { control, onSubmit, open, secret, isPending, onOpenChange, onOpenCreate } = useCreateUserTokenDialog();

  return (
    <>
      <Button type="button" onClick={onOpenCreate}>
        {texts.create.action}
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {secret ? (
            <>
              <DialogHeader>
                <DialogTitle>{texts.secret.title}</DialogTitle>
                <DialogDescription>{texts.secret.description}</DialogDescription>
              </DialogHeader>
              <Code code={secret} copyLabel={texts.secret.copy} copiedLabel={texts.secret.copied} />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{texts.create.dialog.title}</DialogTitle>
                <DialogDescription>{texts.create.dialog.description}</DialogDescription>
              </DialogHeader>
              <Column as="form" gap="md" width="full" onSubmit={onSubmit}>
                <FieldGroup>
                  <TextField
                    control={control}
                    name="name"
                    label={texts.create.dialog.nameLabel}
                    placeholder={texts.create.dialog.namePlaceholder}
                    autoComplete="off"
                  />
                </FieldGroup>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    {texts.create.dialog.cancel}
                  </Button>
                  <SubmitButton loading={isPending}>{texts.create.dialog.submit}</SubmitButton>
                </DialogFooter>
              </Column>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}