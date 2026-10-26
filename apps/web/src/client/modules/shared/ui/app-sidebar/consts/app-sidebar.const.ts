import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";
import { BugPlayIcon, Code2Icon, LayoutDashboardIcon, TicketIcon } from "lucide-react";

import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { url } from "@/shared/build-url.util";

export const appSidebarItems: SidebarItem[] = [
  { href: url.overview(), label: texts.overview, icon: LayoutDashboardIcon },
  { href: url.ticketsBoard(), label: texts.tickets, icon: TicketIcon },
  { href: url.sdk(), label: texts.sdkSetup, icon: Code2Icon },
  { href: url.playground(), label: texts.playground, icon: BugPlayIcon },
];
