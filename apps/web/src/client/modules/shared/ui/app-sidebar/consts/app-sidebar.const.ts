import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";
import { BugPlayIcon, Code2Icon, LayoutDashboardIcon, TicketIcon } from "lucide-react";

import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { path } from "@/shared/path.const";

export const appSidebarItems: SidebarItem[] = [
  { href: path.overview, label: texts.overview, icon: LayoutDashboardIcon },
  { href: path.ticketsBoard, label: texts.tickets, icon: TicketIcon },
  { href: path.sdk, label: texts.sdkSetup, icon: Code2Icon },
  { href: path.playground, label: texts.playground, icon: BugPlayIcon },
];
