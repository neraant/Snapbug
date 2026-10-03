"use client";

import { SidebarLayout } from "@workspace/design-system/components/layout/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import { signOutUser } from "@/client/modules/auth/components/sign-out-button";
import { texts as authTexts } from "@/client/modules/auth/consts/texts";
import { appSidebarItems } from "@/client/modules/shared/app-sidebar/consts/app-sidebar.const";
import { texts as sidebarTexts } from "@/client/modules/shared/app-sidebar/consts/texts";

// @disabled flag
// import { useFindFlags } from "@/client/shared/queries/use-find-flags";
// import { path } from "@/shared/path.const";

type AppSidebarProps = PropsWithChildren<{
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}>;

export function AppSidebar({ user, children }: AppSidebarProps) {
  const pathname = usePathname();

  // @disabled flag
  // const { data: flags } = useFindFlags();
  // const items = appSidebarItems.filter((item) => item.href !== path.setting || flags.settingsVisible);
  const items = appSidebarItems;

  return (
    <SidebarLayout
      title={sidebarTexts.title}
      items={items}
      pathname={pathname}
      user={{ name: user?.name ?? user?.email ?? "User", image: user?.image }}
      linkAs={Link}
      signOutLabel={authTexts.signOut.label}
      onSignOut={signOutUser}
    >
      {children}
    </SidebarLayout>
  );
}
