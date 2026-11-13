import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";
import {
  BugPlayIcon,
  Code2Icon,
  FolderKanbanIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  ScrollTextIcon,
  SettingsIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";

import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { url } from "@/shared/build-url.util";

export const appSidebarItems: SidebarItem[] = [
  { href: url.overview(), label: texts.overview, icon: LayoutDashboardIcon },
  { href: url.ticketsBoard(), label: texts.tickets, icon: TicketIcon },
  { href: url.sdk(), label: texts.sdkSetup, icon: Code2Icon },
  { href: url.mcp(), label: texts.mcp, icon: KeyRoundIcon },
  { href: url.playground(), label: texts.playground, icon: BugPlayIcon },
];

export const appSidebarAdminItems: SidebarItem[] = [
  { href: url.projects(), label: texts.projects, icon: FolderKanbanIcon },
  { href: url.team(), label: texts.team, icon: UsersIcon },
  { href: url.settings(), label: texts.settings, icon: SettingsIcon },
  { href: url.activity(), label: texts.activity, icon: ScrollTextIcon },
];
