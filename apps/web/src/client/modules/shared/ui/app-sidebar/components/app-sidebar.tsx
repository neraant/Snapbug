"use client";

import { useQuery } from "@tanstack/react-query";
import { Column } from "@workspace/design-system/components/layout/column";
import { SidebarLayout } from "@workspace/design-system/components/layout/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, type ReactNode, Suspense, useMemo, useState } from "react";

import { useUserTheme } from "@/client/modules/preference/hooks/use-user-theme";
import { ActiveOrganizationProvider } from "@/client/modules/shared/components/active-organization-provider";
import { texts as sharedTexts } from "@/client/modules/shared/consts/texts.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useInterfaceLanguage } from "@/client/modules/shared/locale/use-interface-language";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { AppSidebarHeader } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-header";
import { AppSidebarOrganizationSwitcher } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-organization-switcher";
import { AppSidebarProjectScope } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-project-scope";
import { appSidebarNavGroups } from "@/client/modules/shared/ui/app-sidebar/consts/app-sidebar.const";
import { texts as sidebarTexts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { signOutUser } from "@/client/modules/shared/utils/sign-out.util";
import { texts as siteTexts } from "@/shared/consts/texts.const";

type AppSidebarProps = PropsWithChildren<{
  defaultSidebarOpen?: boolean;
  activeOrganizationId?: string | null;
  headerToolbarStart?: ReactNode;
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
  headerToolbarStart,
  isAdmin,
  user,
  children,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const { theme, setTheme } = useUserTheme();
  const language = useInterfaceLanguage();
  const { projectId } = useProjectScopeSearchParam();
  const { data: projects = [] } = useQuery(orpcQuery.project.findProjects.queryOptions());
  const projectLookups = useMemo(() => projects.map((project) => ({ id: project.id, slug: project.slug })), [projects]);
  const sidebarGroups = useMemo(() => {
    return appSidebarNavGroups
      .map((group) => ({
        label: sidebarTexts.groups[group.groupKey],
        items: group.items
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => ({
            ...item,
            href: buildPathWithProjectScopeSearchParam(item.href, projectId, projectLookups),
          })),
      }))
      .filter((group) => group.items.length > 0);
  }, [isAdmin, language, projectId, projectLookups]);

  return (
    <ActiveOrganizationProvider organizationId={activeOrganizationId}>
      <SidebarLayout
        title={siteTexts.brand.name}
        description={siteTexts.brand.tagline}
        defaultOpen={defaultSidebarOpen}
        groups={sidebarGroups}
        pathname={pathname}
        user={{ name: user?.name ?? user?.email ?? "User", image: user?.image }}
        linkAs={Link}
        signOutLabel={signingOut ? sharedTexts.signOut.pending : sharedTexts.signOut.label}
        signingOut={signingOut}
        onSignOut={() => {
          if (signingOut) return;
          setSigningOut(true);
          void signOutUser();
        }}
        theme={theme}
        onThemeChange={setTheme}
        themeLabel={sharedTexts.sidebarUserMenu.themeLabel}
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
          <AppSidebarHeader toolbarStart={headerToolbarStart} />
          {children}
        </Column>
      </SidebarLayout>
    </ActiveOrganizationProvider>
  );
}
