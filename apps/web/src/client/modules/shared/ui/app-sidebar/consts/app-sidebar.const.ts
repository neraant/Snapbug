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
  {
    href: url.overview(),
    get label() {
      return texts.overview;
    },
    icon: LayoutDashboardIcon,
  },
  {
    href: url.ticketsBoard(),
    get label() {
      return texts.tickets;
    },
    icon: TicketIcon,
  },
  {
    href: url.sdk(),
    get label() {
      return texts.sdkSetup;
    },
    icon: Code2Icon,
  },
  {
    href: url.mcp(),
    get label() {
      return texts.mcp;
    },
    icon: KeyRoundIcon,
  },
  {
    href: url.playground(),
    get label() {
      return texts.playground;
    },
    icon: BugPlayIcon,
  },
  {
    href: url.settings(),
    get label() {
      return texts.settings;
    },
    icon: SettingsIcon,
  },
];

export const appSidebarAdminItems: SidebarItem[] = [
  {
    href: url.projects(),
    get label() {
      return texts.projects;
    },
    icon: FolderKanbanIcon,
  },
  {
    href: url.team(),
    get label() {
      return texts.team;
    },
    icon: UsersIcon,
  },
  {
    href: url.activity(),
    get label() {
      return texts.activity;
    },
    icon: ScrollTextIcon,
  },
];
