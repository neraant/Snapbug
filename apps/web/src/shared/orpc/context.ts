import type { OrpcContext } from "@workspace/server/orpc/context.const";
import { headers } from "next/headers";

import { auth } from "@/auth";

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function createContext(): Promise<OrpcContext> {
  const ip = await getClientIp();

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { user: null, ip, actor: { type: "api-key", id: null } };
    }

    return {
      ip,
      user: {
        id: userId,
        email: session.user?.email ?? "",
        name: session.user?.name ?? null,
      },
      actor: { type: "user", id: userId },
    };
  } catch {
    return { user: null, ip, actor: { type: "api-key", id: null } };
  }
}
