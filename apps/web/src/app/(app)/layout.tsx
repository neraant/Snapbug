import { parseSidebarOpenState, SIDEBAR_OPEN_STATE_COOKIE } from "@workspace/design-system/lib/sidebar-open-state.util";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { AppSidebar } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar";
import { resolveActiveOrganization } from "@/shared/organization/resolve-active-organization";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  const userId = session?.user?.id;
  const activeOrganization = userId ? await resolveActiveOrganization(userId) : null;
  const cookieStore = await cookies();
  const defaultSidebarOpen = parseSidebarOpenState(cookieStore.get(SIDEBAR_OPEN_STATE_COOKIE)?.value, false);

  return (
    <AppSidebar
      user={session?.user}
      isAdmin={activeOrganization?.role === UserRole.ADMIN}
      activeOrganizationId={activeOrganization?.organizationId ?? null}
      defaultSidebarOpen={defaultSidebarOpen}
    >
      {children}
    </AppSidebar>
  );
}
