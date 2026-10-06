"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { SignInForm } from "@/client/modules/auth/components/sign-in-form";
import { texts } from "@/client/modules/auth/consts/texts.const";
import { path } from "@/shared/path.const";

export default function Page() {
  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.signIn.title}</Typography>
        <Typography variant="text-md" color="muted">
          {texts.signIn.description}
        </Typography>
      </Column>
      <SignInForm />
      <Typography variant="text-sm" color="muted" align="center">
        {texts.signIn.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signUp} />}>
          {texts.signIn.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
