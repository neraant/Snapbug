import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
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
  DialogTrigger,
} from "@workspace/design-system/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@workspace/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { TagsInput } from "@workspace/design-system/components/ui/tags-input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { InfoIcon, UserPlusIcon } from "lucide-react";

import { texts } from "@/client/modules/team/consts/texts.const";
import { useInvitePeople } from "@/client/modules/team/hooks/use-invite-people";

export function InvitePeopleDialog() {
  const {
    open,
    emails,
    error,
    role,
    roleOptions,
    projects,
    selectedProjectIds,
    projectsLocked,
    hasInvalidEmail,
    isPending,
    onOpenChange,
    onEmailsChange,
    onRoleChange,
    toggleProject,
    tagAnnotation,
    onSubmit,
  } = useInvitePeople();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon />
        {texts.invite.action}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{texts.invite.title}</DialogTitle>
          <DialogDescription>{texts.invite.description}</DialogDescription>
        </DialogHeader>
        <Column as="form" gap="lg" onSubmit={onSubmit}>
          <Field data-invalid={Boolean(error)}>
            <Row justify="between" className="h-5.5">
              <FieldLabel htmlFor="team-invite-email">{texts.invite.fieldLabel}</FieldLabel>
              {error ? (
                <Badge variant="destructive">
                  <InfoIcon />
                  {error}
                </Badge>
              ) : null}
            </Row>
            <TagsInput
              id="team-invite-email"
              value={emails}
              onValueChange={onEmailsChange}
              placeholder={texts.invite.placeholder}
              aria-invalid={Boolean(error)}
              removeTagLabel={texts.invite.removeEmail}
              tagAnnotation={tagAnnotation}
            />
            <FieldDescription>{texts.invite.hint}</FieldDescription>
            {error ? <FieldError errors={[{ message: error }]} /> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="team-invite-role">{texts.invite.roleLabel}</FieldLabel>
            <Select value={role} onValueChange={(value) => onRoleChange(value as UserRole)}>
              <SelectTrigger id="team-invite-role" aria-label={texts.invite.roleSelectLabel}>
                <SelectValue>{(value) => (value ? texts.role.label[value as UserRole] : null)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {texts.role.label[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>{texts.invite.roleHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>{texts.invite.projectAccessLabel}</FieldLabel>
            <FieldDescription>
              {projectsLocked ? texts.invite.projectAccessAdmin : texts.invite.projectAccessDescription}
            </FieldDescription>
            {projects.length === 0 ? (
              <Typography variant="text-sm" color="muted">
                {texts.invite.projectAccessEmpty}
              </Typography>
            ) : (
              <Column gap="sm">
                {projects.map((project) => {
                  const checked = projectsLocked || selectedProjectIds.includes(project.id);

                  return (
                    <Field key={project.id} orientation="horizontal">
                      <Checkbox
                        id={`invite-project-${project.id}`}
                        checked={checked}
                        disabled={projectsLocked || isPending}
                        onCheckedChange={(value) => toggleProject(project.id, value === true)}
                        aria-label={texts.invite.projectAccessProject(project.name)}
                      />
                      <FieldLabel htmlFor={`invite-project-${project.id}`}>{project.name}</FieldLabel>
                    </Field>
                  );
                })}
              </Column>
            )}
          </Field>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>{texts.invite.cancel}</DialogClose>
            <SubmitButton loading={isPending} disabled={hasInvalidEmail}>
              {texts.invite.submit}
            </SubmitButton>
          </DialogFooter>
        </Column>
      </DialogContent>
    </Dialog>
  );
}
