"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { RequestPasswordResetForm } from "@/client/modules/auth/components/request-password-reset-form";
import { texts } from "@/client/modules/auth/consts/texts.const";
import { path } from "@/shared/path.const";

export default function Page() {
  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.requestPasswordReset.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.requestPasswordReset.description}
        </Typography>
      </Column>
      <RequestPasswordResetForm />
      <Typography variant="text-sm" color="muted" align="center">
        {texts.requestPasswordReset.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signIn} />}>
          {texts.requestPasswordReset.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
