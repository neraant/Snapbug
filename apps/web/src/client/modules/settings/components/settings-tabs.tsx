import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@workspace/design-system/components/ui/tabs";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { Suspense, useCallback, useRef, useState } from "react";

import { NotificationSettingsForm } from "@/client/modules/notification/components/notification-settings-form";
import { OrganizationSettingsForm } from "@/client/modules/organization/components/organization-settings-form";
import { texts as organizationTexts } from "@/client/modules/organization/consts/texts.const";
import { PreferencesSettingsForm } from "@/client/modules/preference/components/preferences-settings-form";
import { settingsTabs } from "@/client/modules/settings/consts/settings-tab.const";
import { texts } from "@/client/modules/settings/consts/texts.const";
import { useSettingsTabChange } from "@/client/modules/settings/hooks/use-settings-tab-change";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { ProfileSettingsForm } from "@/client/modules/user/components/profile-settings-form";

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

  const allowedTabs = new Set<string>([
    settingsTabs.profile,
    settingsTabs.preferences,
    settingsTabs.notifications,
    settingsTabs.organization,
  ]);

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (allowedTabs.has(value)) {
            setTab(value as typeof tab);
          }
        }}
      >
        <TabsList aria-label={texts.tabs.ariaLabel}>
          <TabsTab value={settingsTabs.profile}>{texts.tabs.profile}</TabsTab>
          <TabsTab value={settingsTabs.preferences}>{texts.tabs.preferences}</TabsTab>
          <TabsTab value={settingsTabs.notifications}>{texts.tabs.notifications}</TabsTab>
          <TabsTab value={settingsTabs.organization}>{texts.tabs.organization}</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value={settingsTabs.profile} keepMounted>
          <Suspense fallback={<ProfileSettingsForm.Fallback />}>
            <ProfileSettingsForm />
          </Suspense>
        </TabsPanel>
        <TabsPanel value={settingsTabs.preferences} keepMounted>
          <Suspense fallback={<PreferencesSettingsForm.Fallback />}>
            <PreferencesSettingsForm />
          </Suspense>
        </TabsPanel>
        <TabsPanel value={settingsTabs.notifications} keepMounted>
          <Suspense fallback={<NotificationSettingsForm.Fallback />}>
            <NotificationSettingsForm />
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
        <TabsTab value={settingsTabs.preferences}>{texts.tabs.preferences}</TabsTab>
        <TabsTab value={settingsTabs.notifications}>{texts.tabs.notifications}</TabsTab>
        <TabsTab value={settingsTabs.organization}>{texts.tabs.organization}</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value={settingsTabs.profile}>
        <ProfileSettingsForm.Fallback />
      </TabsPanel>
    </Tabs>
  );
};
