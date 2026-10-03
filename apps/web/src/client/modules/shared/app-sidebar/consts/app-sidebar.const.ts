import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";
import { HouseIcon } from "lucide-react";

import { texts } from "@/client/modules/shared/app-sidebar/consts/texts";
import { path } from "@/shared/path.const";

export const appSidebarItems: SidebarItem[] = [{ href: path.home, label: texts.home, icon: HouseIcon }];
