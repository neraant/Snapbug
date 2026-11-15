import { ORPCError } from "@orpc/client";
import {
  attachRouteErrorHttpStatus,
  formatRouteErrorHttpStatusPrefix,
  getAppErrorHttpStatus,
  readRouteErrorHttpStatusFromMessage,
} from "@workspace/server/shared/error/app-error-http-status";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it } from "vitest";

describe("getAppErrorHttpStatus", () => {
  it.each([
    [new BadRequestError(ERROR_CODES.INVALID_API_KEY), 400],
    [new UnauthorizedError(ERROR_CODES.UNAUTHORIZED), 401],
    [new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED), 403],
    [new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND), 404],
    [new ORPCError("NOT_FOUND", { message: "missing" }), 404],
    [new ORPCError("TOO_MANY_REQUESTS", { message: "slow down" }), 429],
    [new Error("boom"), 500],
  ])("returns the application HTTP status", (error, status) => {
    expect(getAppErrorHttpStatus(error)).toBe(status);
  });

  it("reads the status from a serialized route error message", () => {
    const message = `${formatRouteErrorHttpStatusPrefix(404)} Project not found`;
    expect(readRouteErrorHttpStatusFromMessage(message)).toBe(404);
    expect(getAppErrorHttpStatus(new Error(message))).toBe(404);
  });

  it("stamps HTTP status for Next.js error boundaries", () => {
    const source = new ORPCError("FORBIDDEN", { message: "Admin required" });
    const routeError = attachRouteErrorHttpStatus(source);

    expect(routeError.httpStatus).toBe(403);
    expect(getAppErrorHttpStatus(routeError)).toBe(403);
    expect(getAppErrorHttpStatus(new Error(routeError.message))).toBe(403);
  });
});
