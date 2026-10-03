import { os } from "@orpc/server";
import { UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";

export const authedMiddleware = os.$context<OrpcContext>().middleware(async ({ context, next }) => {
  if (!context.user) throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, "Sign in to continue");

  return next({ context: { ...context, user: context.user } });
});
