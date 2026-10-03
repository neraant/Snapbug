"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { SignInForm } from "@/client/modules/auth/components/sign-in-form";
import { texts } from "@/client/modules/auth/consts/texts";
import { path } from "@/shared/path.const";

export default function Page() {
  return (
    <Column align="center" justify="center" gap="lg" width="sm" className="mx-auto min-h-dvh px-4">
      <Typography variant="heading-md">{texts.signIn.title}</Typography>
      <SignInForm />
      <Typography variant="text-md" color="muted" align="center">
        {texts.signIn.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signUp} />}>
          {texts.signIn.footerLink}
        </Button>
      </Typography>
    </Column>
  );
}
