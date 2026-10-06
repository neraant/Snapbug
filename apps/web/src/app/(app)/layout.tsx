import { findOnboarding } from "@workspace/server/modules/organization/organization.api";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { hasCompletedOnboarding } from "@/client/modules/onboarding/utils/has-completed-onboarding.util";
import { AppSidebar } from "@/client/modules/shared/app-sidebar/components/app-sidebar";
import { path } from "@/shared/path.const";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  if (session?.user?.id) {
    const snapshot = await findOnboarding(session.user.id);
    if (!snapshot || !hasCompletedOnboarding(snapshot)) {
      redirect(path.onboarding);
    }
  }

  return <AppSidebar user={session?.user}>{children}</AppSidebar>;
}
