import { os } from "@orpc/server";
import { ForbiddenError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export function requireRole(role: UserRole) {
  return os.$context<OrpcContext>().middleware(async ({ context, next }) => {
    if (context.user?.role !== role) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    return next({ context: { ...context, user: context.user } });
  });
}

export const adminMiddleware = requireRole(UserRole.ADMIN);
