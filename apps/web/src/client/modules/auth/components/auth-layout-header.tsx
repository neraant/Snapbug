import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { BugIcon } from "lucide-react";
import Link from "next/link";

import { AuthThemeToggle } from "@/client/modules/auth/components/auth-theme-toggle";
import { url } from "@/shared/build-url.util";
import { texts } from "@/shared/consts/texts.const";

export function AuthLayoutHeader() {
  return (
    <Row justify="between" align="center" width="full" wrap={false} minWidth="0">
      <Link href={url.signIn()}>
        <Row gap="sm" align="center" wrap={false} minWidth="0">
          <Avatar variant="brand">
            <AvatarFallback>
              <BugIcon className="size-5" />
            </AvatarFallback>
          </Avatar>
          <Column gap="none" align="start" minWidth="0">
            <Typography variant="label">{texts.brand.name}</Typography>
            <Typography variant="text-sm" color="muted">
              {texts.brand.tagline}
            </Typography>
          </Column>
        </Row>
      </Link>
      <AuthThemeToggle />
    </Row>
  );
}
