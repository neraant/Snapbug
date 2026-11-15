import { ColorField } from "@workspace/design-system/components/forms/color-field";
import { SelectField } from "@workspace/design-system/components/forms/select-field";
import { SwitchField } from "@workspace/design-system/components/forms/switch-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Separator } from "@workspace/design-system/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/design-system/components/ui/sheet";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { projectColorValues } from "@workspace/validation/shared/project-color.schema";
import { ArchiveIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { Suspense } from "react";

import { texts } from "@/client/modules/project/consts/texts.const";
import { useProjectDangerActions } from "@/client/modules/project/hooks/use-project-danger-actions";
import { useProjectSettingsForm } from "@/client/modules/project/hooks/use-project-settings-form";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";

type ProjectSettingsSheetProps = {
  project: ProjectListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectSettingsSheet({ project, open, onOpenChange }: ProjectSettingsSheetProps) {
  const closeSheet = () => onOpenChange(false);
  const { confirm, bind } = useConfirmDialog();
  const { control, onSubmit, loading, memberOptions } = useProjectSettingsForm({ project, onSaved: closeSheet });
  const { onArchive, onRestore, onDelete, isRestoring, isArchived } = useProjectDangerActions({
    project,
    onProjectChanged: closeSheet,
    onProjectDeleted: closeSheet,
  });

  const openArchiveConfirm = () => {
    confirm({
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

  const openDeleteConfirm = () => {
    confirm({
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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <Column as="form" gap="lg" width="full" className="flex h-full min-h-0" onSubmit={onSubmit}>
            <SheetHeader>
              <Row align="center" gap="sm">
                <SheetTitle>{texts.settingsSheet.title}</SheetTitle>
                {isArchived ? <Badge variant="secondary">{texts.settingsSheet.archivedBadge}</Badge> : null}
              </Row>
              <SheetDescription>{texts.settingsSheet.description}</SheetDescription>
            </SheetHeader>
            <SheetBody>
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
              <Separator />
              <Column gap="sm" width="full">
                <Typography variant="text-sm" weight="semibold">
                  {texts.settingsSheet.danger.title}
                </Typography>
                <Typography variant="text-xs" color="muted">
                  {texts.settingsSheet.danger.description}
                </Typography>
                <Row gap="sm" wrap>
                  {isArchived ? (
                    <Button type="button" variant="outline" disabled={isRestoring} onClick={() => onRestore()}>
                      <RotateCcwIcon />
                      {texts.settingsSheet.danger.restore}
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={openArchiveConfirm}>
                      <ArchiveIcon />
                      {texts.settingsSheet.danger.archive}
                    </Button>
                  )}
                  <Button type="button" variant="destructive" onClick={openDeleteConfirm}>
                    <Trash2Icon />
                    {texts.settingsSheet.danger.delete}
                  </Button>
                </Row>
              </Column>
            </SheetBody>
            <SheetFooter>
              <Row align="center" gap="sm" justify="end" width="full">
                <Button type="button" variant="outline" onClick={closeSheet} disabled={loading}>
                  {texts.settingsSheet.cancel}
                </Button>
                <Button type="submit" disabled={loading}>
                  {texts.settingsSheet.submit}
                </Button>
              </Row>
            </SheetFooter>
          </Column>
        </SheetContent>
      </Sheet>
      <ConfirmDialog {...bind()} />
    </>
  );
}
