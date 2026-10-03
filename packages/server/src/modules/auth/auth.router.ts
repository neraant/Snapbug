import { implement } from "@orpc/server";
import { signUp } from "@workspace/server/modules/auth/auth.api";
import { authContract } from "@workspace/server/modules/auth/auth.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(authContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const authRouter = os.router({
  signUp: os.signUp.handler(async ({ input }) => await signUp(input)),
});
