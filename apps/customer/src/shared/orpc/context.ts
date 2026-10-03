import type { OrpcContext } from "@workspace/server/orpc/context.const";

import { auth } from "@/auth";

export async function createContext(): Promise<OrpcContext> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { user: null };

    return {
      user: {
        id: userId,
        email: session.user?.email ?? "",
        name: session.user?.name ?? null,
        role: session.user?.role ?? null,
      },
    };
  } catch {
    return { user: null };
  }
}
