const ticketsBase = "/tickets";

export const routePattern = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  onboarding: "/onboarding",

  overview: "/overview",
  playground: "/playground",
  sdk: "/sdk",
  ticketsBoard: `${ticketsBase}/board`,
  ticket: `${ticketsBase}/:shortId`,
} as const;
