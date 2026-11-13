import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { commentContract } from "@workspace/server/modules/comment/comment.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(commentContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const commentRouter = os.router({
  addComment: authed.addComment.handler(
    async ({ input, context }) => await container.comment.addComment.execute(input, context.user.id, context.actor),
  ),
  findComments: authed.findComments.handler(
    async ({ input, context }) => await container.comment.findComments.execute(input, context.user.id),
  ),
});
