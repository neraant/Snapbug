import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";
import { CodeIcon, HouseIcon } from "lucide-react";

import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { path } from "@/shared/path.const";

export const appSidebarItems: SidebarItem[] = [
  { href: path.overview, label: texts.overview, icon: HouseIcon },
  { href: path.playground, label: texts.playground, icon: CodeIcon },
];
