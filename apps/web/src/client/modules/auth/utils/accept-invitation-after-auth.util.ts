import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { getSession } from "next-auth/react";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

const SESSION_WAIT_MS = 45_000;

export async function waitForAuthenticatedSession(): Promise<boolean> {
  const deadline = Date.now() + SESSION_WAIT_MS;
  while (Date.now() < deadline) {
    const session = await getSession();
    if (session?.user?.id) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

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
    const sessionReady = await waitForAuthenticatedSession();
    if (!sessionReady) {
      toast.add({ title: texts.invitePage.toast.sessionWaitTimedOut, type: "error" });
      return false;
    }
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
