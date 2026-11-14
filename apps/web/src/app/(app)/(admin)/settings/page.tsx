"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { OrganizationSettingsForm } from "@/client/modules/organization/components/organization-settings-form";
import { texts } from "@/client/modules/organization/consts/texts.const";
import { InterfaceLanguageForm } from "@/client/modules/user/components/interface-language-form";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description}>
      <Suspense fallback={<OrganizationSettingsForm.Fallback />}>
        <OrganizationSettingsForm />
      </Suspense>
      <Suspense fallback={<InterfaceLanguageForm.Fallback />}>
        <InterfaceLanguageForm />
      </Suspense>
    </PageContainer>
  );
}
