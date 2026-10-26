import { container } from "@workspace/server/container";

import { auth } from "@/auth";
import { url } from "@/shared/build-url.util";
import { hasCompletedOnboarding } from "@/shared/utils/has-completed-onboarding.util";
import { isGuestAuthPath, isOnboardingPath } from "@/shared/utils/onboarding-gate.util";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const isGuestAuthPage = isGuestAuthPath(pathname);
  const isOnboardingPage = isOnboardingPath(pathname);

  if (!req.auth && !isGuestAuthPage) {
    return Response.redirect(new URL(url.signIn(), req.nextUrl));
  }

  if (!req.auth) {
    return;
  }

  const userId = req.auth.user?.id;
  if (!userId) {
    return;
  }

  const snapshot = await container.organization.findOnboarding.execute(userId);
  const completed = hasCompletedOnboarding(snapshot);

  if (isGuestAuthPage) {
    return Response.redirect(new URL(completed ? url.overview() : url.onboarding(), req.nextUrl));
  }

  if (completed && isOnboardingPage) {
    return Response.redirect(new URL(url.overview(), req.nextUrl));
  }

  if (!completed && !isOnboardingPage) {
    return Response.redirect(new URL(url.onboarding(), req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
