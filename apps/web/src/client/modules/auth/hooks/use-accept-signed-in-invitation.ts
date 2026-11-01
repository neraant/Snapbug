import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { acceptInvitationAfterAuth } from "@/client/modules/auth/utils/accept-invitation-after-auth.util";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { url } from "@/shared/build-url.util";

export function useAcceptSignedInInvitation(invitationToken: string) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    acceptInvitationAfterAuth(invitationToken, acceptInvitation)
      .then((accepted) => {
        if (!active) {
          return;
        }

        if (accepted) {
          router.replace(url.overview());
          return;
        }

        setFailed(true);
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [acceptInvitation, invitationToken, router]);

  return { failed };
}
