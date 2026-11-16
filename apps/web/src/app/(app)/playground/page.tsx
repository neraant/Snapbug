"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Badge } from "@workspace/design-system/components/ui/badge";

import { Playground } from "@/client/modules/playground/components/playground";
import { texts } from "@/client/modules/playground/consts/texts.const";

export default function Page() {
  return (
    <PageContainer
      title={texts.page.title}
      description={texts.page.description}
      badge={
        <Badge variant="outline" className="font-normal">
          {texts.page.badge}
        </Badge>
      }
    >
      <Playground />
    </PageContainer>
  );
}