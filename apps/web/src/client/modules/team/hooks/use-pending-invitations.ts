import { toast } from "@workspace/design-system/components/ui/toast";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";

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
      .catch(() => {
        toast.add({
          title: texts.pending.resendError,
          type: "error",
        });
      });
  };

  const revoke = async (invitationId: string) => {
    await revokeInvitation({ invitationId });
    toast.add({ title: texts.pending.revokeSuccess, type: "success" });
  };

  const copyLink = (invitationId: string) => {
    copyInvitationLink({ invitationId })
      .then(async (result) => {
        await copy(result.inviteUrl);
        toast.add({ title: texts.pending.copySuccess, type: "success" });
      })
      .catch(() => {
        toast.add({
          title: texts.pending.copyError,
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
