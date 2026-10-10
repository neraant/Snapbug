import { path } from "@/shared/path.const";

export function isGuestAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith(path.signIn) ||
    pathname.startsWith(path.signUp) ||
    pathname.startsWith(path.forgotPassword) ||
    pathname.startsWith(path.resetPassword)
  );
}

export function isOnboardingPath(pathname: string): boolean {
  return pathname.startsWith(path.onboarding);
}
