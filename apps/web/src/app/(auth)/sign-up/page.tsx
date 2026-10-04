"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { SignUpForm } from "@/client/modules/auth/components/sign-up-form";
import { texts } from "@/client/modules/auth/consts/texts";
import { path } from "@/shared/path.const";

export default function Page() {
  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.signUp.title}</Typography>
        <Typography variant="text-md" color="muted">
          {texts.signUp.description}
        </Typography>
      </Column>
      <SignUpForm />
      <Typography variant="text-sm" color="muted" align="center">
        {texts.signUp.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signIn} />}>
          {texts.signUp.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
