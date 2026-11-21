import { ColorField } from "@workspace/design-system/components/forms/color-field";
import { SelectField } from "@workspace/design-system/components/forms/select-field";
import { SwitchField } from "@workspace/design-system/components/forms/switch-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Separator } from "@workspace/design-system/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/design-system/components/ui/sheet";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { projectColorValues } from "@workspace/validation/shared/project-color.schema";
import { Suspense } from "react";

import { texts } from "@/client/modules/project/consts/texts.const";
import { useProjectDangerActions } from "@/client/modules/project/hooks/use-project-danger-actions";
import { useProjectSettingsForm } from "@/client/modules/project/hooks/use-project-settings-form";
import { useProjectSettingsSheetClose } from "@/client/modules/project/hooks/use-project-settings-sheet-close";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { getProjectInitials } from "@/client/modules/project/utils/get-project-initials.util";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";

type ProjectSettingsSheetProps = {
  project: ProjectListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectSettingsSheet({ project, open, onOpenChange }: ProjectSettingsSheetProps) {
  const { confirm: confirmAction, bind: bindActionConfirm } = useConfirmDialog();
  const { confirm: confirmClose, bind: bindCloseConfirm } = useConfirmDialog();
  const { data: membership } = useFindMembershipByUser();
  const isAdmin = membership?.role === UserRole.ADMIN;

  const { control, onSubmit, loading, memberOptions, isDirty, reset } = useProjectSettingsForm({
    project,
    onSaved: () => onOpenChange(false),
  });
  const { close, handleOpenChange } = useProjectSettingsSheetClose({
    isDirty,
    onOpenChange,
    reset,
    confirm: confirmClose,
  });

  const { onArchive, onRestore, onDelete, isArchiving, isRestoring, isDeleting, isArchived } = useProjectDangerActions({
    project,
    onProjectChanged: () => onOpenChange(false),
    onProjectDeleted: () => onOpenChange(false),
  });

  const openArchiveConfirm = () => {
    confirmAction({
      title: texts.settingsSheet.archiveDialog.title(project.name),
      description: texts.settingsSheet.archiveDialog.description(project.name),
      confirmLabel: texts.settingsSheet.archiveDialog.confirm,
      variant: "default",
      errorFallback: texts.settingsSheet.toast.archiveError,
      onConfirm: async () => {
        try {
          await onArchive();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.archiveError));
        }
      },
    });
  };

  const openRestoreConfirm = () => {
    confirmAction({
      title: texts.settingsSheet.restoreDialog.title(project.name),
      description: texts.settingsSheet.restoreDialog.description(project.name),
      confirmLabel: texts.settingsSheet.restoreDialog.confirm,
      variant: "default",
      errorFallback: texts.settingsSheet.toast.restoreError,
      onConfirm: async () => {
        try {
          await onRestore();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.restoreError));
        }
      },
    });
  };

  const openDeleteConfirm = () => {
    confirmAction({
      title: texts.settingsSheet.deleteDialog.title(project.name),
      description: texts.settingsSheet.deleteDialog.description(),
      confirmLabel: texts.settingsSheet.deleteDialog.confirm,
      variant: "destructive",
      confirmText: project.name,
      errorFallback: texts.settingsSheet.toast.deleteError,
      onConfirm: async () => {
        try {
          await onDelete();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.deleteError));
        }
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right">
          <Column as="form" gap="none" width="full" className="flex h-full min-h-0" onSubmit={onSubmit}>
            <SheetHeader className="shrink-0">
              <Row align="center" gap="sm">
                <Avatar variant="brand" size="sm" color={project.color}>
                  <AvatarFallback>{getProjectInitials(project.name)}</AvatarFallback>
                </Avatar>
                <SheetTitle className="min-w-0 flex-1 truncate">{project.name}</SheetTitle>
                {isArchived ? <Badge variant="secondary">{texts.settingsSheet.archivedBadge}</Badge> : null}
              </Row>
            </SheetHeader>
            <SheetBody className="min-h-0 flex-1 overflow-y-auto pb-4">
              <Column gap="lg" width="full">
                <Column gap="md" width="full">
                  <Typography variant="heading-xs">{texts.settingsSheet.section.general}</Typography>
                  <FieldGroup>
                    <TextField
                      control={control}
                      name="name"
                      type="text"
                      label={texts.settingsSheet.field.name.label}
                      placeholder={texts.settingsSheet.field.name.placeholder}
                    />
                    <TextField
                      control={control}
                      name="slug"
                      type="text"
                      label={texts.settingsSheet.field.slug.label}
                      placeholder={texts.settingsSheet.field.slug.placeholder}
                      description={texts.settingsSheet.field.slug.description}
                    />
                    <ColorField
                      control={control}
                      name="color"
                      label={texts.settingsSheet.field.color.label}
                      colors={projectColorValues}
                      swatchLabel={texts.settingsSheet.field.color.swatchLabel}
                    />
                    <Suspense fallback={null}>
                      <SelectField
                        control={control}
                        name="defaultAssigneeId"
                        label={texts.settingsSheet.field.defaultAssignee.label}
                        placeholder={texts.settingsSheet.field.defaultAssignee.placeholder}
                        options={memberOptions}
                      />
                    </Suspense>
                  </FieldGroup>
                </Column>
                <Separator />
                <Column gap="md" width="full">
                  <Typography variant="heading-xs">{texts.settingsSheet.section.privacy}</Typography>
                  <FieldGroup>
                    <SwitchField
                      control={control}
                      name="storeVisitorIp"
                      label={texts.settingsSheet.field.storeVisitorIp.label}
                      description={texts.settingsSheet.field.storeVisitorIp.description}
                    />
                    <SwitchField
                      control={control}
                      name="collectVisitorEmail"
                      label={texts.settingsSheet.field.collectVisitorEmail.label}
                      description={texts.settingsSheet.field.collectVisitorEmail.description}
                    />
                  </FieldGroup>
                </Column>
                {isAdmin ? (
                  <>
                    <Separator />
                    <Column
                      gap="md"
                      width="full"
                      padding="md"
                      className="rounded-lg border border-destructive/25 bg-background"
                    >
                      <Column gap="xs" width="full">
                        <Typography variant="text-sm" weight="semibold">
                          {texts.settingsSheet.danger.title}
                        </Typography>
                        <Typography variant="text-xs" color="muted">
                          {texts.settingsSheet.danger.description}
                        </Typography>
                      </Column>
                      {isArchived ? (
                        <Row align="center" justify="between" gap="md" width="full">
                          <Column gap="xs" minWidth="0">
                            <Typography variant="text-sm" weight="medium">
                              {texts.settingsSheet.danger.archive.label}
                            </Typography>
                            <Typography variant="text-xs" color="muted">
                              {texts.settingsSheet.danger.archive.description}
                            </Typography>
                          </Column>
                          <Button type="button" variant="outline" disabled={isRestoring} onClick={openRestoreConfirm}>
                            {texts.settingsSheet.danger.archive.actionRestore}
                          </Button>
                        </Row>
                      ) : (
                        <Row align="center" justify="between" gap="md" width="full">
                          <Column gap="xs" minWidth="0">
                            <Typography variant="text-sm" weight="medium">
                              {texts.settingsSheet.danger.archive.label}
                            </Typography>
                            <Typography variant="text-xs" color="muted">
                              {texts.settingsSheet.danger.archive.description}
                            </Typography>
                          </Column>
                          <Button type="button" variant="outline" disabled={isArchiving} onClick={openArchiveConfirm}>
                            {texts.settingsSheet.danger.archive.action}
                          </Button>
                        </Row>
                      )}
                      <Row align="center" justify="between" gap="md" width="full">
                        <Column gap="xs" minWidth="0">
                          <Typography variant="text-sm" weight="medium">
                            {texts.settingsSheet.danger.delete.label}
                          </Typography>
                          <Typography variant="text-xs" color="muted">
                            {texts.settingsSheet.danger.delete.description}
                          </Typography>
                        </Column>
                        <Button type="button" variant="destructive" disabled={isDeleting} onClick={openDeleteConfirm}>
                          {texts.settingsSheet.danger.delete.action}
                        </Button>
                      </Row>
                    </Column>
                  </>
                ) : null}
              </Column>
            </SheetBody>
            <SheetFooter className="shrink-0 border-t border-border">
              <Row align="center" gap="sm" justify="end" width="full">
                <Button type="button" variant="outline" onClick={close} disabled={loading}>
                  {texts.settingsSheet.cancel}
                </Button>
                <SubmitButton type="submit" loading={loading} disabled={!isDirty}>
                  {texts.settingsSheet.submit}
                </SubmitButton>
              </Row>
            </SheetFooter>
          </Column>
        </SheetContent>
      </Sheet>
      <ConfirmDialog {...bindActionConfirm()} />
      <ConfirmDialog {...bindCloseConfirm()} />
    </>
  );
}
