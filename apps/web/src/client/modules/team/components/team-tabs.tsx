import {
  Tabs,
  TabsBadge,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@workspace/design-system/components/ui/tabs";
import { Suspense } from "react";

import { useFindInvitations } from "@/client/modules/shared/queries/use-find-invitations";
import { useFindTeamMembers } from "@/client/modules/shared/queries/use-find-team-members";
import { PendingInvitations } from "@/client/modules/team/components/pending-invitations";
import { Team } from "@/client/modules/team/components/team";
import { teamTabs } from "@/client/modules/team/consts/team-tab.const";
import { texts } from "@/client/modules/team/consts/texts.const";
import { useTeamTab } from "@/client/modules/team/hooks/use-team-tab";
import { countPendingInvitations } from "@/client/modules/team/utils/count-pending-invitations.util";

export function TeamTabs() {
  const { tab, setTab } = useTeamTab();
  const { data: members } = useFindTeamMembers();
  const { data: invitations } = useFindInvitations();
  const invitationCount = countPendingInvitations(invitations);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === teamTabs.members || value === teamTabs.invitations) {
          setTab(value);
        }
      }}
    >
      <TabsList aria-label={texts.tabs.ariaLabel}>
        <TabsTab value={teamTabs.members}>
          {texts.tabs.members}
          <TabsBadge>{members.length}</TabsBadge>
        </TabsTab>
        <TabsTab value={teamTabs.invitations}>
          {texts.tabs.invitations}
          {invitationCount > 0 ? <TabsBadge>{invitationCount}</TabsBadge> : null}
        </TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value={teamTabs.members} keepMounted>
        <Suspense fallback={<Team.Fallback />}>
          <Team />
        </Suspense>
      </TabsPanel>
      <TabsPanel value={teamTabs.invitations} keepMounted>
        <Suspense fallback={<PendingInvitations.Fallback />}>
          <PendingInvitations />
        </Suspense>
      </TabsPanel>
    </Tabs>
  );
}

TeamTabs.Fallback = function TeamTabsFallback() {
  return (
    <Tabs value={teamTabs.members}>
      <TabsList aria-label={texts.tabs.ariaLabel}>
        <TabsTab value={teamTabs.members}>{texts.tabs.members}</TabsTab>
        <TabsTab value={teamTabs.invitations}>{texts.tabs.invitations}</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value={teamTabs.members}>
        <Team.Fallback />
      </TabsPanel>
    </Tabs>
  );
};
