import {
  SettingsSection,
  SettingsSections,
} from "@workspace/design-system/components/layout/settings-section";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@workspace/design-system/components/ui/tabs";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { Suspense, useCallback, useRef, useState } from "react";

import { OrganizationSettingsForm } from "@/client/modules/organization/components/organization-settings-form";
import { texts as organizationTexts } from "@/client/modules/organization/consts/texts.const";
import { settingsTabs } from "@/client/modules/settings/consts/settings-tab.const";
import { texts } from "@/client/modules/settings/consts/texts.const";
import { useSettingsTabChange } from "@/client/modules/settings/hooks/use-settings-tab-change";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { InterfaceLanguageForm } from "@/client/modules/user/components/interface-language-form";
import { UserTokenList } from "@/client/modules/user-token/components/user-token-list";

export function SettingsTabs() {
  const { data: membership } = useFindMembershipByUser();
  const isAdmin = membership?.role === UserRole.ADMIN;
  const [organizationDirty, setOrganizationDirty] = useState(false);
  const resetOrganizationRef = useRef<VoidFunction>(() => undefined);
  const { confirm, bind } = useConfirmDialog();

  const registerOrganizationReset = useCallback((reset: VoidFunction) => {
    resetOrganizationRef.current = reset;
  }, []);

  const { tab, setTab } = useSettingsTabChange({
    organizationDirty,
    resetOrganization: () => resetOrganizationRef.current(),
    confirm,
  });

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (
            value === settingsTabs.profile ||
            value === settingsTabs.organization ||
            value === settingsTabs.tokens
          ) {
            setTab(value);
          }
        }}
      >
        <TabsList aria-label={texts.tabs.ariaLabel}>
          <TabsTab value={settingsTabs.profile}>{texts.tabs.profile}</TabsTab>
          <TabsTab value={settingsTabs.organization}>{texts.tabs.organization}</TabsTab>
          <TabsTab value={settingsTabs.tokens}>{texts.tabs.tokens}</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value={settingsTabs.profile} keepMounted>
          <Suspense fallback={<InterfaceLanguageForm.Fallback />}>
            <InterfaceLanguageForm />
          </Suspense>
        </TabsPanel>
        <TabsPanel value={settingsTabs.organization} keepMounted>
          {!isAdmin ? (
            <Typography variant="text-sm" color="muted" className="mb-6 max-w-4xl">
              {organizationTexts.pageNote}
            </Typography>
          ) : null}
          <Suspense fallback={<OrganizationSettingsForm.Fallback />}>
            <OrganizationSettingsForm
              readOnly={!isAdmin}
              onDirtyChange={setOrganizationDirty}
              onResetRegister={registerOrganizationReset}
            />
          </Suspense>
        </TabsPanel>
        <TabsPanel value={settingsTabs.tokens} keepMounted>
          <SettingsSections>
            <SettingsSection
              showSeparator={false}
              title={texts.tokens.section.title}
              description={texts.tokens.section.description}
            >
              <Suspense fallback={<UserTokenList.Fallback />}>
                <UserTokenList />
              </Suspense>
            </SettingsSection>
          </SettingsSections>
        </TabsPanel>
      </Tabs>
      <ConfirmDialog {...bind()} />
    </>
  );
}

SettingsTabs.Fallback = function SettingsTabsFallback() {
  return (
    <Tabs value={settingsTabs.profile}>
      <TabsList aria-label={texts.tabs.ariaLabel}>
        <TabsTab value={settingsTabs.profile}>{texts.tabs.profile}</TabsTab>
        <TabsTab value={settingsTabs.organization}>{texts.tabs.organization}</TabsTab>
        <TabsTab value={settingsTabs.tokens}>{texts.tabs.tokens}</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value={settingsTabs.profile}>
        <InterfaceLanguageForm.Fallback />
      </TabsPanel>
    </Tabs>
  );
};