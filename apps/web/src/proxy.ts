import { container } from "@workspace/server/container";

import { auth } from "@/auth";
import { url } from "@/shared/build-url.util";
import { ACTIVE_ORGANIZATION_COOKIE } from "@/shared/organization/active-organization-cookie.const";
import { chooseActiveMembership } from "@/shared/organization/resolve-active-organization";
import { hasCompletedOnboarding } from "@/shared/utils/has-completed-onboarding.util";
import { isGuestAuthPath, isInvitationAuthPath, isOnboardingPath } from "@/shared/utils/onboarding-gate.util";
import { parseInvitationToken } from "@/shared/utils/parse-invitation-token.util";

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

  if (isInvitationAuthPath(pathname) && parseInvitationToken(req.nextUrl.searchParams.get("invitation"))) {
    return;
  }

  const userId = req.auth.user?.id;
  if (!userId) {
    return;
  }

  const memberships = await container.membership.findMembershipsByUser.execute(userId);
  const activeMembership = chooseActiveMembership(memberships, req.cookies.get(ACTIVE_ORGANIZATION_COOKIE)?.value);
  const snapshot = await container.organization.findOnboarding.execute(
    userId,
    activeMembership?.organizationId ?? null,
  );
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
