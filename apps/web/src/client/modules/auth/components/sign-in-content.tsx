import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { SignInForm } from "@/client/modules/auth/components/sign-in-form";
import { texts } from "@/client/modules/auth/consts/texts.const";
import { authPathWithInvitation } from "@/client/modules/auth/utils/auth-path-with-invitation.util";
import { parseInvitationToken } from "@/client/modules/auth/utils/parse-invitation-token.util";
import { path } from "@/shared/path.const";

export function SignInContent() {
  const searchParams = useSearchParams();
  const invitationToken = parseInvitationToken(searchParams.get("invitation"));

  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.signIn.title}</Typography>
        <Typography variant="text-md" color="muted">
          {texts.signIn.description}
        </Typography>
      </Column>
      <SignInForm invitationToken={invitationToken} />
      <Typography variant="text-sm" color="muted" align="center">
        {texts.signIn.footerPrompt}{" "}
        <Button
          nativeButton={false}
          variant="link"
          render={<Link href={authPathWithInvitation(path.signUp, invitationToken)} />}
        >
          {texts.signIn.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
