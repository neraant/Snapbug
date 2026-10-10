import { signOut } from "next-auth/react";

import { path } from "@/shared/path.const";

// @disabled posthog
// import { AuthAnalyticsEvent } from "@workspace/analytics";
// import { resetAnalytics, trackEvent } from "@workspace/analytics/client";

export function signOutUser() {
  signOut({
    redirect: true,
    redirectTo: path.signIn,
  });

  // @disabled posthog
  // resetAnalytics();
  // trackEvent(AuthAnalyticsEvent.SignedOut, {});
}
