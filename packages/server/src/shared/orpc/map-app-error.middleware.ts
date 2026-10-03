import { ORPCError, os } from "@orpc/server";
import { AppError } from "@workspace/server/shared/error/app-errors";

export const mapAppErrorMiddleware = os.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new ORPCError(error.code, {
        message: error.message,
        data: { errorCode: error.errorCode },
        cause: error,
      });
    }
    throw error;
  }
});
