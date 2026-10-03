export const AuthAnalyticsEvent = {
  SignedUp: "user_signed_up",
  SignedIn: "user_signed_in",
  SignedOut: "user_signed_out",
} as const;

export type AuthEventPropsMap = {
  [AuthAnalyticsEvent.SignedUp]: Record<string, never>;
  [AuthAnalyticsEvent.SignedIn]: Record<string, never>;
  [AuthAnalyticsEvent.SignedOut]: Record<string, never>;
};
