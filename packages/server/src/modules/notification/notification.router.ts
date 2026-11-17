import { implement } from "@orpc/server";
import { container } from "@workspace/server/container";
import { notificationContract } from "@workspace/server/modules/notification/notification.contract";
import { authedMiddleware } from "@workspace/server/shared/orpc/authed.middleware";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { mapAppErrorMiddleware } from "@workspace/server/shared/orpc/map-app-error.middleware";

const os = implement(notificationContract).$context<OrpcContext>().use(mapAppErrorMiddleware);
const authed = os.use(authedMiddleware);

export const notificationRouter = os.router({
  list: authed.list.handler(
    async ({ context, input }) =>
      await container.notification.list.execute(context.user.id, context.organizationId, input ?? {}),
  ),
  unreadCount: authed.unreadCount.handler(
    async ({ context }) => await container.notification.unreadCount.execute(context.user.id, context.organizationId),
  ),
  markRead: authed.markRead.handler(
    async ({ context, input }) =>
      await container.notification.markRead.execute(input, context.user.id, context.organizationId),
  ),
  markUnread: authed.markUnread.handler(
    async ({ context, input }) =>
      await container.notification.markUnread.execute(input, context.user.id, context.organizationId),
  ),
  markAllRead: authed.markAllRead.handler(
    async ({ context }) => await container.notification.markAllRead.execute(context.user.id, context.organizationId),
  ),
  archive: authed.archive.handler(
    async ({ context, input }) =>
      await container.notification.archive.execute(input, context.user.id, context.organizationId),
  ),
});