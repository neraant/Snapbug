import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";

import { texts } from "@/client/modules/auth/consts/texts.const";

type AcceptInvitationFn = (input: { token: string }) => Promise<unknown>;

export async function acceptInvitationAfterAuth(
  token: string | undefined,
  acceptInvitation: AcceptInvitationFn,
): Promise<void> {
  if (!token) {
    return;
  }

  try {
    await acceptInvitation({ token });
  } catch (error) {
    toast.add({
      title: getAppErrorMessage(error, texts.invitation.toast.acceptError),
      type: "error",
    });
  }
}
