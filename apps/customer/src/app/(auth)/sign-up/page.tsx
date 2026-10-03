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
    <Column align="center" justify="center" gap="lg" width="sm" className="mx-auto min-h-dvh px-4">
      <Typography variant="heading-md">{texts.signUp.title}</Typography>
      <SignUpForm />
      <Typography variant="text-md" color="muted" align="center">
        {texts.signUp.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signIn} />}>
          {texts.signUp.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
