"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";

import { Playground } from "@/client/modules/playground/components/playground";
import { texts } from "@/client/modules/shared/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.playground.title} description={texts.playground.description}>
      <Playground />
    </PageContainer>
  );
}
