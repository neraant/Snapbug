import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { authContract } from "@workspace/server/modules/auth/auth.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { rateLimitMiddleware } from "@workspace/server/shared/orpc/rate-limit.middleware";

const os = implement(authContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const authRouter = os.router({
  signUp: os.signUp.handler(async ({ input }) => await container.auth.signUp.execute(input)),
  verifyCredentials: os.verifyCredentials.handler(
    async ({ input }) => await container.auth.verifyCredentials.execute(input),
  ),
  requestResetPassword: os.requestResetPassword
    .use(rateLimitMiddleware)
    .handler(async ({ input }) => await container.auth.requestResetPassword.execute(input)),
  resetPassword: os.resetPassword.handler(async ({ input }) => await container.auth.resetPassword.execute(input)),
});
