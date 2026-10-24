import { ForbiddenError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export class WidgetIngestOriginService {
  assertAllowed(allowedDomains: readonly string[], requestOrigin: string | null): void {
    if (allowedDomains.length === 0) return;

    if (!requestOrigin) {
      throw new ForbiddenError(ERROR_CODES.ORIGIN_NOT_ALLOWED, "Origin is not allowed");
    }

    let originHost: string;
    try {
      originHost = new URL(requestOrigin).host.toLowerCase();
    } catch {
      throw new ForbiddenError(ERROR_CODES.ORIGIN_NOT_ALLOWED, "Origin is not allowed");
    }

    if (!allowedDomains.includes(originHost)) {
      throw new ForbiddenError(ERROR_CODES.ORIGIN_NOT_ALLOWED, "Origin is not allowed");
    }
  }
}
