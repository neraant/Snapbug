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

import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { useAppSidebarCreateOrganization } from "@/client/modules/shared/ui/app-sidebar/hooks/use-app-sidebar-create-organization";

type AppSidebarCreateOrganizationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AppSidebarCreateOrganization({ open, onOpenChange }: AppSidebarCreateOrganizationProps) {
  const { control, onSubmit, loading } = useAppSidebarCreateOrganization({
    onCreated: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{texts.organization.dialog.title}</DialogTitle>
          <DialogDescription>{texts.organization.dialog.description}</DialogDescription>
        </DialogHeader>
        <Column as="form" gap="md" width="full" onSubmit={onSubmit}>
          <FieldGroup>
            <TextField
              control={control}
              name="name"
              label={texts.organization.dialog.nameLabel}
              placeholder={texts.organization.dialog.namePlaceholder}
              autoComplete="organization"
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {texts.organization.dialog.cancel}
            </Button>
            <SubmitButton loading={loading}>{texts.organization.dialog.submit}</SubmitButton>
          </DialogFooter>
        </Column>
      </DialogContent>
    </Dialog>
  );
}
