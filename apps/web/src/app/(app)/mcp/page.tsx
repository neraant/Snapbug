"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { settingsTabs } from "@/client/modules/settings/consts/settings-tab.const";
import { texts } from "@/client/modules/user-token/consts/texts.const";
import { routePattern } from "@/shared/build-url.util";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <Column gap="md" width="full" className="max-w-4xl">
        <Typography variant="text-sm" color="muted">
          {texts.redirectDescription}
        </Typography>
        <Button nativeButton={false} render={<Link href={`${routePattern.settings}?tab=${settingsTabs.tokens}`} />}>
          {texts.manageInSettings}
        </Button>
      </Column>
    </PageContainer>
  );
}