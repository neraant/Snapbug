"use client";

import type { ReactNode } from "react";

// @disabled posthog
// import { capturePageview, identifyUser, initAnalyticsClient } from "@workspace/analytics/client";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

type AnalyticsUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
};

type Props = {
  children: ReactNode;
  appName: "web" | "admin";
  user?: AnalyticsUser | null;
};

export function AnalyticsProvider({ children, appName: _appName, user: _user }: Props) {
  // @disabled posthog
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  //
  // useEffect(() => {
  //   initAnalyticsClient(appName);
  // }, [appName]);
  //
  // useEffect(() => {
  //   if (!pathname) return;
  //   const query = searchParams?.toString();
  //   capturePageview(pathname + (query ? `?${query}` : ""));
  // }, [pathname, searchParams]);
  //
  // useEffect(() => {
  //   if (!user?.id) return;
  //
  //   identifyUser(user.id, {
  //     email: user.email ?? undefined,
  //     name: user.name ?? undefined,
  //     role: user.role,
  //   });
  // }, [user?.id, user?.email, user?.name, user?.role]);

  return <>{children}</>;
}
