export const teamTabSearchParamKey = "tab";

export const teamTabs = {
  members: "members",
  invitations: "invitations",
} as const;

export type TeamTab = (typeof teamTabs)[keyof typeof teamTabs];

export const defaultTeamTab = teamTabs.members;
