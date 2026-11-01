import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { resolveActiveOrganization } from "@/shared/organization/resolve-active-organization";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  const userId = session?.user?.id;
  const activeOrganization = userId ? await resolveActiveOrganization(userId) : null;

  if (activeOrganization?.role !== UserRole.ADMIN) {
    notFound();
  }

  return children;
}
