"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { OrganizationSettingsForm } from "@/client/modules/organization/components/organization-settings-form";
import { texts } from "@/client/modules/organization/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <Suspense fallback={<OrganizationSettingsForm.Fallback />}>
        <OrganizationSettingsForm />
      </Suspense>
    </PageContainer>
  );
}
