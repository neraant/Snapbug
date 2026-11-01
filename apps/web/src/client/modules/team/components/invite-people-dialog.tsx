import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
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
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { TagsInput } from "@workspace/design-system/components/ui/tags-input";
import { InfoIcon, UserPlusIcon } from "lucide-react";

import { texts } from "@/client/modules/team/consts/texts.const";
import { useInvitePeople } from "@/client/modules/team/hooks/use-invite-people";

export function InvitePeopleDialog() {
  const { open, emails, error, isPending, onOpenChange, onEmailsChange, onSubmit } = useInvitePeople();

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
              {error && (
                <Badge variant="destructive">
                  <InfoIcon />
                  {error}
                </Badge>
              )}
            </Row>
            <TagsInput
              id="team-invite-email"
              value={emails}
              onValueChange={onEmailsChange}
              placeholder={texts.invite.placeholder}
              aria-invalid={Boolean(error)}
              removeTagLabel={texts.invite.removeEmail}
            />
            <FieldDescription>{texts.invite.hint}</FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>{texts.invite.cancel}</DialogClose>
            <SubmitButton loading={isPending}>{texts.invite.submit}</SubmitButton>
          </DialogFooter>
        </Column>
      </DialogContent>
    </Dialog>
  );
}
