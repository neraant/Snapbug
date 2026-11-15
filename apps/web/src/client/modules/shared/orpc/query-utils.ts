import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import { attachRouteErrorHttpStatus } from "@workspace/server/error/app-error-http-status";
import type { AppRouter } from "@workspace/server/router";

import { stampRouteOrpcQueryUtils } from "@/client/modules/shared/orpc/stamp-route-error-http-status";

function getRpcUrl(): string {
  if (typeof window !== "undefined") {
    return new URL("/api/rpc", window.location.origin).href;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required for server-side RPC requests");
  }
  return new URL("/api/rpc", baseUrl).href;
}

const link = new RPCLink({
  url: getRpcUrl(),
  interceptors: [
    async (options) => {
      try {
        return await options.next(options);
      } catch (error) {
        throw attachRouteErrorHttpStatus(error);
      }
    },
  ],
  headers: async () => {
    if (typeof window !== "undefined") {
      return {};
    }

    const { headers } = await import("next/headers");
    return {
      cookie: (await headers()).get("cookie") ?? "",
    };
  },
});

const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

export const orpcQuery = stampRouteOrpcQueryUtils(createORPCReactQueryUtils(orpcClient));
