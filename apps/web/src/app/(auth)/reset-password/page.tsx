"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

import { ResetPasswordForm } from "@/client/modules/auth/components/reset-password-form";
import { texts } from "@/client/modules/auth/consts/texts";
import { path } from "@/shared/path.const";

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const isValidToken = z.uuid().safeParse(token).success;

  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.resetPassword.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.resetPassword.description}
        </Typography>
      </Column>
      {isValidToken && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Column width="full" gap="sm">
          <Typography variant="text-sm" color="muted">
            {texts.resetPassword.invalidLink}
          </Typography>
          <Button nativeButton={false} variant="link" render={<Link href={path.forgotPassword} />}>
            {texts.resetPassword.requestNewLink}
          </Button>
        </Column>
      )}
    </Column>
  );
}
