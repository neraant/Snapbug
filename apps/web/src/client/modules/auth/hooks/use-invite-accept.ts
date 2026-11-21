import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { url } from "@/shared/build-url.util";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type UseInviteAcceptInput = {
  token: string;
  organizationName: string;
};

export function useInviteAccept({ token, organizationName }: UseInviteAcceptInput) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation, isPending } = useAcceptInvitation();
  const accept = async () => {
    try {
      const membership = await acceptInvitation({ token });
      await selectActiveOrganization(membership.organizationId);
      toast.add({ title: texts.invitePage.toast.joined(organizationName), type: "success" });
      router.replace(url.overview());
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.invitePage.toast.acceptError),
        type: "error",
      });
    }
  };

  return { accept, isPending };
}
