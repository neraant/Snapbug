"use client";

import { useCallback } from "react";

import { type SettingsTab, settingsTabs } from "@/client/modules/settings/consts/settings-tab.const";
import { texts } from "@/client/modules/settings/consts/texts.const";
import { useSettingsTab } from "@/client/modules/settings/hooks/use-settings-tab";

type ConfirmDiscard = (request: {
  title: string;
  description: string;
  confirmLabel: string;
  variant: "destructive";
  onConfirm: VoidFunction;
}) => void;

type UseSettingsTabChangeInput = {
  organizationDirty: boolean;
  resetOrganization: VoidFunction;
  confirm: ConfirmDiscard;
};

export function useSettingsTabChange({ organizationDirty, resetOrganization, confirm }: UseSettingsTabChangeInput) {
  const { tab, setTab: setTabRaw } = useSettingsTab();

  const setTab = useCallback(
    (nextTab: SettingsTab) => {
      if (nextTab === tab) {
        return;
      }

      if (organizationDirty && tab === settingsTabs.organization) {
        confirm({
          title: texts.unsavedTabChange.title,
          description: texts.unsavedTabChange.description,
          confirmLabel: texts.unsavedTabChange.confirm,
          variant: "destructive",
          onConfirm: () => {
            resetOrganization();
            setTabRaw(nextTab);
          },
        });
        return;
      }

      setTabRaw(nextTab);
    },
    [confirm, organizationDirty, resetOrganization, setTabRaw, tab],
  );

  return { tab, setTab };
}
