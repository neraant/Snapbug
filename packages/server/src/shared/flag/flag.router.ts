// @disabled flag
import { implement } from "@orpc/server";
import { findFlags } from "@workspace/server/shared/flag/flag.api";
import { flagContract } from "@workspace/server/shared/flag/flag.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(flagContract).$context<OrpcContext>().use(mapAppErrorMiddleware);

export const flagRouter = os.router({
  findMany: os.findMany.handler(async () => await findFlags()),
});
