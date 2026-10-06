import { Button } from "@workspace/design-system/components/ui/button";
import { signOut } from "next-auth/react";

import { texts } from "@/client/modules/auth/consts/texts.const";
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

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={signOutUser}>
      {texts.signOut.label}
    </Button>
  );
}
