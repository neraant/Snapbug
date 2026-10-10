"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { SidebarLayout } from "@workspace/design-system/components/layout/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import { texts as sharedTexts } from "@/client/modules/shared/consts/texts.const";
import { AppSidebarHeader } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-header";
import { appSidebarItems } from "@/client/modules/shared/ui/app-sidebar/consts/app-sidebar.const";
import { resolveHeaderPageTitle } from "@/client/modules/shared/ui/app-sidebar/utils/resolve-header-page-title.util";
import { signOutUser } from "@/client/modules/shared/utils/sign-out.util";
import { texts as siteTexts } from "@/shared/consts/texts.const";

type AppSidebarProps = PropsWithChildren<{
  defaultSidebarOpen?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}>;

export function AppSidebar({ defaultSidebarOpen, user, children }: AppSidebarProps) {
  const pathname = usePathname();
  const pageTitle = resolveHeaderPageTitle(pathname, appSidebarItems, siteTexts.brand.name);

  return (
    <SidebarLayout
      title={siteTexts.brand.name}
      description={siteTexts.brand.tagline}
      defaultOpen={defaultSidebarOpen}
      items={appSidebarItems}
      pathname={pathname}
      user={{ name: user?.name ?? user?.email ?? "User", image: user?.image }}
      linkAs={Link}
      signOutLabel={sharedTexts.signOut.label}
      onSignOut={signOutUser}
    >
      <Column gap="none" className="min-h-svh">
        <AppSidebarHeader pageTitle={pageTitle} />
        {children}
      </Column>
    </SidebarLayout>
  );
}
