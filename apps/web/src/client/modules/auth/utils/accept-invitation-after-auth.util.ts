import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type AcceptInvitationFn = (input: { token: string }) => Promise<{ organizationId: string }>;

const acceptByToken = new Map<string, Promise<boolean>>();

export function acceptInvitationAfterAuth(
  token: string | undefined,
  acceptInvitation: AcceptInvitationFn,
): Promise<boolean> {
  if (!token) {
    return Promise.resolve(false);
  }

  const existing = acceptByToken.get(token);
  if (existing) {
    return existing;
  }

  const pending = acceptInvitationToken(token, acceptInvitation).then((accepted) => {
    if (!accepted) {
      acceptByToken.delete(token);
    }

    return accepted;
  });
  acceptByToken.set(token, pending);
  return pending;
}

async function acceptInvitationToken(token: string, acceptInvitation: AcceptInvitationFn): Promise<boolean> {
  try {
    const membership = await acceptInvitation({ token });
    await selectActiveOrganization(membership.organizationId);
    return true;
  } catch (error) {
    toast.add({
      title: getAppErrorMessage(error, texts.invitation.toast.acceptError),
      type: "error",
    });
    return false;
  }
}
