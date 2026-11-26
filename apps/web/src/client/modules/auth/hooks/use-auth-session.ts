"use client";

import { createContext, useContext } from "react";

export type AuthSessionValue = {
  email?: string;
  isSignedIn: boolean;
};

export const AuthSessionContext = createContext<AuthSessionValue>({ isSignedIn: false });

export function useAuthSession(): AuthSessionValue {
  return useContext(AuthSessionContext);
}
