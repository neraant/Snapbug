import type { OrpcContext } from "@workspace/server/orpc/context.const";
import { headers } from "next/headers";

import { auth } from "@/auth";
import { resolveActiveOrganization } from "@/shared/organization/resolve-active-organization";

async function getRequestHeaders() {
  return await headers();
}

async function getClientIp(): Promise<string> {
  const headerStore = await getRequestHeaders();
  const forwarded = headerStore.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

async function getRequestOrigin(): Promise<string | null> {
  const headerStore = await getRequestHeaders();
  return headerStore.get("origin");
}

export async function createContext(): Promise<OrpcContext> {
  const [ip, requestOrigin] = await Promise.all([getClientIp(), getRequestOrigin()]);

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { user: null, organizationId: null, ip, actor: { type: "api-key", id: null }, requestOrigin };
    }

    const activeOrganization = await resolveActiveOrganization(userId, true);

    return {
      ip,
      requestOrigin,
      organizationId: activeOrganization?.organizationId ?? null,
      user: {
        id: userId,
        email: session.user?.email ?? "",
        name: session.user?.name ?? null,
        role: activeOrganization?.role,
      },
      actor: { type: "user", id: userId },
    };
  } catch {
    return { user: null, organizationId: null, ip, actor: { type: "api-key", id: null }, requestOrigin };
  }
}
