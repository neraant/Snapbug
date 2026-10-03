import { os } from "@orpc/server";
import { ForbiddenError, UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export const adminMiddleware = os.$context<OrpcContext>().middleware(async ({ context, next }) => {
  if (!context.user) throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, "Sign in to continue");
  if (context.user.role !== UserRole.ADMIN) {
    throw new ForbiddenError(ERROR_CODES.UNAUTHORIZED, "Admin access required");
  }
  return next({ context: { ...context, user: context.user } });
});
