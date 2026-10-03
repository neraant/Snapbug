import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { AppSidebar } from "@/client/modules/shared/app-sidebar/components/app-sidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return <AppSidebar user={session?.user}>{children}</AppSidebar>;
}
