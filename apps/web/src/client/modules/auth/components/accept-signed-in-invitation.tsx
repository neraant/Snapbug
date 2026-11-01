"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { useAcceptSignedInInvitation } from "@/client/modules/auth/hooks/use-accept-signed-in-invitation";
import { url } from "@/shared/build-url.util";

type AcceptSignedInInvitationProps = {
  invitationToken: string;
};

export function AcceptSignedInInvitation({ invitationToken }: AcceptSignedInInvitationProps) {
  const { failed } = useAcceptSignedInInvitation(invitationToken);

  return (
    <Column width="full" gap="sm">
      <Typography variant="heading-lg">
        {failed ? texts.invitation.acceptFailedTitle : texts.invitation.joiningTitle}
      </Typography>
      <Typography variant="text-md" color="muted">
        {failed ? texts.invitation.toast.acceptError : texts.invitation.joiningDescription}
      </Typography>
      {failed ? (
        <Button nativeButton={false} variant="link" render={<Link href={url.overview()} />}>
          {texts.invitation.continueToApp}
        </Button>
      ) : null}
    </Column>
  );
}
