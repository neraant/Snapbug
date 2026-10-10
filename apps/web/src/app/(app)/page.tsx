"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { OverviewStatSection } from "@/client/modules/overview/components/overview-stat-section";
import { texts } from "@/client/modules/shared/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.overview.title} description={texts.overview.description}>
      <Suspense fallback={<OverviewStatSection.Fallback />}>
        <OverviewStatSection />
      </Suspense>
    </PageContainer>
  );
}
