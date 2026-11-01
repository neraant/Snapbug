import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { sendInvitationsInputDtoSchema } from "@workspace/validation/modules/invitation/dto/send-invitation.schema";
import { type FormEvent, useState } from "react";

import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useSendInvitations } from "@/client/modules/shared/queries/use-send-invitations";
import { texts } from "@/client/modules/team/consts/texts.const";

export function useInvitePeople() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const { data: currentMembership } = useFindMembershipByUser();
  const { mutateAsync: sendInvitations, isPending } = useSendInvitations();

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEmails([]);
      setError(undefined);
    }
  };

  const onEmailsChange = (nextEmails: string[]) => {
    setEmails(nextEmails);
    setError(undefined);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmails = [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
    const result = sendInvitationsInputDtoSchema.safeParse({
      organizationId: currentMembership?.organizationId,
      emails: normalizedEmails,
    });

    if (!result.success) {
      setError(texts.invite.validationError);
      return;
    }

    try {
      await sendInvitations(result.data);
      toast.add({ title: texts.invite.success, type: "success" });
      onOpenChange(false);
    } catch (sendError) {
      toast.add({
        title: getAppErrorMessage(sendError, texts.invite.error),
        type: "error",
      });
    }
  };

  return {
    open,
    emails,
    error,
    isPending,
    onOpenChange,
    onEmailsChange,
    onSubmit,
  };
}
