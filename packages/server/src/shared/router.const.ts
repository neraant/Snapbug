import { authRouter } from "@workspace/server/modules/auth/auth.router";

// @disabled flag
// import { flagRouter } from "@workspace/server/shared/flag/flag.router";

export const router = {
  auth: authRouter,
  // @disabled flag
  // flag: flagRouter,
};
export type AppRouter = typeof router;
