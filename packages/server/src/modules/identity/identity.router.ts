import { implement } from "@orpc/server";
import {
  createUser,
  findUserByEmail,
  findUserCredentialsByEmail,
} from "@workspace/server/modules/identity/identity.api";
import { identityContract } from "@workspace/server/modules/identity/identity.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(identityContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const identityRouter = os.router({
  createUser: os.createUser.handler(async ({ input }) => await createUser(input)),
  findUserByEmail: os.findUserByEmail.handler(async ({ input }) => await findUserByEmail(input)),
  findUserCredentialsByEmail: os.findUserCredentialsByEmail.handler(
    async ({ input }) => await findUserCredentialsByEmail(input),
  ),
});
