"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { SidebarLayout } from "@workspace/design-system/components/layout/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, Suspense, useMemo } from "react";

import { ActiveOrganizationProvider } from "@/client/modules/shared/components/active-organization-provider";
import { texts as sharedTexts } from "@/client/modules/shared/consts/texts.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useInterfaceLanguage } from "@/client/modules/shared/locale/use-interface-language";
import { AppSidebarHeader } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-header";
import { AppSidebarOrganizationSwitcher } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-organization-switcher";
import { AppSidebarProjectScope } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-project-scope";
import { appSidebarAdminItems, appSidebarItems } from "@/client/modules/shared/ui/app-sidebar/consts/app-sidebar.const";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { signOutUser } from "@/client/modules/shared/utils/sign-out.util";
import { texts as siteTexts } from "@/shared/consts/texts.const";

type AppSidebarProps = PropsWithChildren<{
  defaultSidebarOpen?: boolean;
  activeOrganizationId?: string | null;
  isAdmin?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}>;

export function AppSidebar({
  activeOrganizationId = null,
  defaultSidebarOpen,
  isAdmin,
  user,
  children,
}: AppSidebarProps) {
  const pathname = usePathname();
  const language = useInterfaceLanguage();
  const { projectId } = useProjectScopeSearchParam();
  const sidebarItems = useMemo(() => {
    const items = isAdmin ? [...appSidebarItems, ...appSidebarAdminItems] : appSidebarItems;

    return items.map((item) => ({
      ...item,
      href: buildPathWithProjectScopeSearchParam(item.href, projectId),
    }));
  }, [isAdmin, language, projectId]);

  return (
    <ActiveOrganizationProvider organizationId={activeOrganizationId}>
      <SidebarLayout
        title={siteTexts.brand.name}
        description={siteTexts.brand.tagline}
        defaultOpen={defaultSidebarOpen}
        items={sidebarItems}
        pathname={pathname}
        user={{ name: user?.name ?? user?.email ?? "User", image: user?.image }}
        linkAs={Link}
        signOutLabel={sharedTexts.signOut.label}
        onSignOut={signOutUser}
        scopeSelector={
          <Column gap="sm" width="full">
            <Suspense fallback={<AppSidebarOrganizationSwitcher.Fallback />}>
              <AppSidebarOrganizationSwitcher />
            </Suspense>
            <Suspense fallback={<AppSidebarProjectScope.Fallback />}>
              <AppSidebarProjectScope />
            </Suspense>
          </Column>
        }
      >
        <Column gap="none" className="flex h-svh min-h-0 flex-col overflow-hidden">
          <AppSidebarHeader />
          {children}
        </Column>
      </SidebarLayout>
    </ActiveOrganizationProvider>
  );
}
