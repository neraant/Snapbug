import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { auditContract } from "@workspace/server/modules/audit/audit.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";
import { adminMiddleware } from "@workspace/server/shared/orpc/require-role.middleware";

const os = implement(auditContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const admin = os.use(authedMiddleware).use(adminMiddleware);

export const auditRouter = os.router({
  findActivityLogs: admin.findActivityLogs.handler(
    async ({ context }) => await container.audit.findActivityLogs.execute(context.user.id, context.organizationId),
  ),
});
