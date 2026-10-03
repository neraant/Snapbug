"use client";

import { Center } from "@workspace/design-system/components/layout/center";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { SignUpForm } from "@/client/modules/auth/components/sign-up-form";
import { texts } from "@/client/modules/auth/consts/texts";
import { path } from "@/shared/path.const";

export default function Page() {
  return (
    <Center>
      <Typography variant="heading-md" align="center">
        {texts.signUp.title}
      </Typography>
      <SignUpForm />
      <Typography variant="text-md" color="muted" align="center">
        {texts.signUp.footerPrompt}{" "}
        <Button nativeButton={false} variant="link" render={<Link href={path.signIn} />}>
          {texts.signUp.footerLink}
        </Button>
      </Typography>
    </Center>
  );
}
