import { implement } from "@orpc/server";
import {
  requestResetPassword,
  resetPassword,
  signUp,
  verifyCredentials,
} from "@workspace/server/modules/auth/auth.api";
import { authContract } from "@workspace/server/modules/auth/auth.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { rateLimitMiddleware } from "@workspace/server/shared/orpc/rate-limit.middleware";

const os = implement(authContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const authRouter = os.router({
  signUp: os.signUp.handler(async ({ input }) => await signUp(input)),
  verifyCredentials: os.verifyCredentials.handler(async ({ input }) => await verifyCredentials(input)),
  requestResetPassword: os.requestResetPassword
    .use(rateLimitMiddleware)
    .handler(async ({ input }) => await requestResetPassword(input)),
  resetPassword: os.resetPassword.handler(async ({ input }) => await resetPassword(input)),
});
