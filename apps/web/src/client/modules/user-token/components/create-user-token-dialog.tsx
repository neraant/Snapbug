import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
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

import { SecretRevealDialog } from "@/client/modules/shared/components/secret-reveal-dialog";
import { texts } from "@/client/modules/user-token/consts/texts.const";
import { useCreateUserTokenDialog } from "@/client/modules/user-token/hooks/use-create-user-token-dialog";

export function CreateUserTokenDialog() {
  const { control, onSubmit, open, secret, createdTokenName, isPending, onOpenChange, onOpenCreate } =
    useCreateUserTokenDialog();

  return (
    <>
      <Button type="button" onClick={onOpenCreate}>
        {texts.create.action}
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={secret != null}>
        <DialogContent showClose={secret == null}>
          {secret ? (
            <SecretRevealDialog
              secret={secret}
              kind="userToken"
              metadataName={createdTokenName ?? undefined}
              showUsageSnippet
              onDone={() => onOpenChange(false)}
            />
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
