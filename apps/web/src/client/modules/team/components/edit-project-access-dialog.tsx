import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/design-system/components/ui/dialog";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { Suspense } from "react";

import { texts } from "@/client/modules/team/consts/texts.const";
import { useEditProjectAccess } from "@/client/modules/team/hooks/use-edit-project-access";

type EditProjectAccessDialogProps = {
  membershipId: string | null;
  onOpenChange: (open: boolean) => void;
};

export function EditProjectAccessDialog({ membershipId, onOpenChange }: EditProjectAccessDialogProps) {
  const close = () => onOpenChange(false);

  return (
    <Dialog open={membershipId !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {membershipId ? (
          <Suspense fallback={<EditProjectAccessDialogFallback />}>
            <EditProjectAccessForm key={membershipId} membershipId={membershipId} onClose={close} />
          </Suspense>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type EditProjectAccessFormProps = {
  membershipId: string;
  onClose: () => void;
};

function EditProjectAccessForm({ membershipId, onClose }: EditProjectAccessFormProps) {
  const { projects, locked, displayName, selectedProjectIds, toggleProject, onSubmit, isPending } =
    useEditProjectAccess(membershipId, onClose);

  return (
    <Column as="form" gap="lg" onSubmit={onSubmit}>
      <DialogHeader>
        <DialogTitle>{texts.projectAccess.title}</DialogTitle>
        <DialogDescription>
          {locked ? texts.projectAccess.adminExplanation : texts.projectAccess.description(displayName)}
        </DialogDescription>
      </DialogHeader>
      {projects.length === 0 ? (
        <Typography variant="text-sm" color="muted">
          {texts.projectAccess.empty}
        </Typography>
      ) : (
        <Column gap="sm">
          {projects.map((project) => {
            const checked = locked || selectedProjectIds.includes(project.id);

            return (
              <Field key={project.id} orientation="horizontal">
                <Checkbox
                  id={`project-access-${project.id}`}
                  checked={checked}
                  disabled={locked || isPending}
                  onCheckedChange={(value) => toggleProject(project.id, value === true)}
                  aria-label={texts.projectAccess.project(project.name)}
                />
                <FieldLabel htmlFor={`project-access-${project.id}`}>{project.name}</FieldLabel>
              </Field>
            );
          })}
        </Column>
      )}
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>{texts.projectAccess.cancel}</DialogClose>
        {locked ? null : <SubmitButton loading={isPending}>{texts.projectAccess.save}</SubmitButton>}
      </DialogFooter>
    </Column>
  );
}

function EditProjectAccessDialogFallback() {
  return <Skeleton className="h-40 w-full" />;
}
