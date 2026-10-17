"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";

import { SdkSetupDocsLink } from "@/client/modules/sdk-setup/components/sdk-setup-docs-link";
import { SdkSetupEmptyProjectHint } from "@/client/modules/sdk-setup/components/sdk-setup-empty-project-hint";
import { SdkSetupProjectContent } from "@/client/modules/sdk-setup/components/sdk-setup-project-content";
import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";

export default function Page() {
  const { projectId } = useProjectScopeSearchParam();

  // TODO: Dev State Control toolbar and simulated ?state= loading/empty/error.

  return (
    <PageContainer title={texts.title} description={texts.description} actions={<SdkSetupDocsLink />}>
      {projectId ? <SdkSetupProjectContent projectId={projectId} /> : <SdkSetupEmptyProjectHint />}
    </PageContainer>
  );
}
