import { implement } from "@orpc/server";
import {
  createUser,
  findUserByEmail,
  findUserCredentialsByEmail,
} from "@workspace/server/modules/identity/identity.api";
import { identityContract } from "@workspace/server/modules/identity/identity.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(identityContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const identityRouter = os.router({
  createUser: authed.createUser.handler(async ({ input }) => await createUser(input)),
  findUserByEmail: authed.findUserByEmail.handler(async ({ input }) => await findUserByEmail(input)),
  findUserCredentialsByEmail: authed.findUserCredentialsByEmail.handler(
    async ({ input }) => await findUserCredentialsByEmail(input),
  ),
});
