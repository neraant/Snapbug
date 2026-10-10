import { parseSidebarOpenState, SIDEBAR_OPEN_STATE_COOKIE } from "@workspace/design-system/lib/sidebar-open-state.util";
import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { AppSidebar } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultSidebarOpen = parseSidebarOpenState(cookieStore.get(SIDEBAR_OPEN_STATE_COOKIE)?.value, false);

  return (
    <AppSidebar user={session?.user} defaultSidebarOpen={defaultSidebarOpen}>
      {children}
    </AppSidebar>
  );
}
