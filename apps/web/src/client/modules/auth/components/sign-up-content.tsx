import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { SignUpForm } from "@/client/modules/auth/components/sign-up-form";
import { texts } from "@/client/modules/auth/consts/texts.const";
import { parseInvitationToken } from "@/client/modules/auth/utils/parse-invitation-token.util";
import { url } from "@/shared/build-url.util";

export function SignUpContent() {
  const searchParams = useSearchParams();
  const invitationToken = parseInvitationToken(searchParams.get("invitation"));

  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.signUp.title}</Typography>
        <Typography variant="text-md" color="muted">
          {texts.signUp.description}
        </Typography>
      </Column>
      {invitationToken ? (
        <Suspense fallback={<SignUpForm.Fallback />}>
          <SignUpForm invitationToken={invitationToken} />
        </Suspense>
      ) : (
        <SignUpForm />
      )}
      <Typography variant="text-sm" color="muted" align="center">
        {texts.signUp.footerPrompt}{" "}
        <Button
          nativeButton={false}
          variant="link"
          render={<Link href={url.signIn({ invitation: invitationToken })} />}
        >
          {texts.signUp.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
