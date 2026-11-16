"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { SettingsTabs } from "@/client/modules/settings/components/settings-tabs";
import { texts } from "@/client/modules/settings/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <Suspense fallback={<SettingsTabs.Fallback />}>
        <SettingsTabs />
      </Suspense>
    </PageContainer>
  );
}