import { signOut } from "next-auth/react";

import { url } from "@/shared/build-url.util";

// @disabled posthog
// import { AuthAnalyticsEvent } from "@workspace/analytics";
// import { resetAnalytics, trackEvent } from "@workspace/analytics/client";

export function signOutUser() {
  signOut({
    redirect: true,
    redirectTo: url.signIn(),
  });

  // @disabled posthog
  // resetAnalytics();
  // trackEvent(AuthAnalyticsEvent.SignedOut, {});
}
