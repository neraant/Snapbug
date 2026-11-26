"use client";

import type { PropsWithChildren } from "react";

import { AuthSessionContext, type AuthSessionValue } from "@/client/modules/auth/hooks/use-auth-session";

type AuthSessionProps = PropsWithChildren<AuthSessionValue>;

export function AuthSession({ email, isSignedIn, children }: AuthSessionProps) {
  return <AuthSessionContext.Provider value={{ email, isSignedIn }}>{children}</AuthSessionContext.Provider>;
}
