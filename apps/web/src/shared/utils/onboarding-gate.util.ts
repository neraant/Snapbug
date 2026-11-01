import { url } from "@/shared/build-url.util";

export function isGuestAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith(url.signIn()) ||
    pathname.startsWith(url.signUp()) ||
    pathname.startsWith(url.forgotPassword()) ||
    pathname.startsWith(url.resetPassword())
  );
}

export function isInvitationAuthPath(pathname: string): boolean {
  return pathname.startsWith(url.signIn()) || pathname.startsWith(url.signUp());
}

export function isOnboardingPath(pathname: string): boolean {
  return pathname.startsWith(url.onboarding());
}
