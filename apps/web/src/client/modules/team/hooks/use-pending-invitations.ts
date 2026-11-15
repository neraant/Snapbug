import { toast } from "@workspace/design-system/components/ui/toast";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";

import { useCopyInvitationLink } from "@/client/modules/shared/queries/use-copy-invitation-link";
import { useFindInvitations } from "@/client/modules/shared/queries/use-find-invitations";
import { useResendInvitation } from "@/client/modules/shared/queries/use-resend-invitation";
import { useRevokeInvitation } from "@/client/modules/shared/queries/use-revoke-invitation";
import { texts } from "@/client/modules/team/consts/texts.const";

export function usePendingInvitations() {
  const { data: invitations } = useFindInvitations();
  const { copy } = useCopyText();
  const { mutateAsync: resendInvitation, isPending: isResending } = useResendInvitation();
  const { mutateAsync: revokeInvitation, isPending: isRevoking } = useRevokeInvitation();
  const { mutateAsync: copyInvitationLink, isPending: isCopying } = useCopyInvitationLink();

  const resend = (invitationId: string) => {
    resendInvitation({ invitationId })
      .then(() => {
        toast.add({ title: texts.pending.resendSuccess, type: "success" });
      })
      .catch((error: unknown) => {
        toast.add({
          title: getAppErrorMessage(error, texts.pending.resendError),
          type: "error",
        });
      });
  };

  const revoke = (invitationId: string) => {
    revokeInvitation({ invitationId })
      .then(() => {
        toast.add({ title: texts.pending.revokeSuccess, type: "success" });
      })
      .catch((error: unknown) => {
        toast.add({
          title: getAppErrorMessage(error, texts.pending.revokeError),
          type: "error",
        });
      });
  };

  const copyLink = (invitationId: string) => {
    copyInvitationLink({ invitationId })
      .then(async (result) => {
        await copy(result.inviteUrl);
        toast.add({ title: texts.pending.copySuccess, type: "success" });
      })
      .catch((error: unknown) => {
        toast.add({
          title: getAppErrorMessage(error, texts.pending.copyError),
          type: "error",
        });
      });
  };

  return {
    invitations,
    resend,
    revoke,
    copyLink,
    isMutating: isResending || isRevoking || isCopying,
  };
}