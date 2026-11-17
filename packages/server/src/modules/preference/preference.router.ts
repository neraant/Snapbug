import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { preferenceContract } from "@workspace/server/modules/preference/preference.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(preferenceContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const preferenceRouter = os.router({
  findUserPreference: authed.findUserPreference.handler(
    async ({ context }) => await container.preference.findUserPreference.execute(context.user.id),
  ),
  updateUserPreference: authed.updateUserPreference.handler(
    async ({ input, context }) => await container.preference.updateUserPreference.execute(context.user.id, input),
  ),
});