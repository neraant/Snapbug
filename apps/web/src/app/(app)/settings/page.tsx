"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { Suspense } from "react";

import { OrganizationSettingsForm } from "@/client/modules/organization/components/organization-settings-form";
import { texts as organizationTexts } from "@/client/modules/organization/consts/texts.const";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { InterfaceLanguageForm } from "@/client/modules/user/components/interface-language-form";
import { texts as languageTexts } from "@/client/modules/user/consts/texts.const";

export default function Page() {
  const { data: membership } = useFindMembershipByUser();
  const isAdmin = membership?.role === UserRole.ADMIN;

  return (
    <PageContainer
      title={isAdmin ? organizationTexts.title : languageTexts.title}
      description={isAdmin ? organizationTexts.description : languageTexts.description}
    >
      {isAdmin ? (
        <Suspense fallback={<OrganizationSettingsForm.Fallback />}>
          <OrganizationSettingsForm />
        </Suspense>
      ) : null}
      <Suspense fallback={<InterfaceLanguageForm.Fallback />}>
        <InterfaceLanguageForm />
      </Suspense>
    </PageContainer>
  );
}
