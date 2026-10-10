import { findOnboarding } from "@workspace/server/modules/organization/organization.api";

import { auth } from "@/auth";
import { path } from "@/shared/path.const";
import { hasCompletedOnboarding } from "@/shared/utils/has-completed-onboarding.util";
import { isGuestAuthPath, isOnboardingPath } from "@/shared/utils/onboarding-gate.util";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const isGuestAuthPage = isGuestAuthPath(pathname);
  const isOnboardingPage = isOnboardingPath(pathname);

  if (!req.auth && !isGuestAuthPage) {
    return Response.redirect(new URL(path.signIn, req.nextUrl));
  }

  if (!req.auth) {
    return;
  }

  const userId = req.auth.user?.id;
  if (!userId) {
    return;
  }

  const snapshot = await findOnboarding(userId);
  const completed = hasCompletedOnboarding(snapshot);

  if (isGuestAuthPage) {
    return Response.redirect(new URL(completed ? path.overview : path.onboarding, req.nextUrl));
  }

  if (completed && isOnboardingPage) {
    return Response.redirect(new URL(path.overview, req.nextUrl));
  }

  if (!completed && !isOnboardingPage) {
    return Response.redirect(new URL(path.onboarding, req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
