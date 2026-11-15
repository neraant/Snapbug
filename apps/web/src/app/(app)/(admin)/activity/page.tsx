"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";

import { ActivityLog } from "@/client/modules/activity-log/components/activity-log";
import { texts } from "@/client/modules/activity-log/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <ActivityLog />
    </PageContainer>
  );
}