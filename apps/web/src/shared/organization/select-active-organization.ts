"use server";

import { container } from "@workspace/server/container";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import {
  ACTIVE_ORGANIZATION_COOKIE,
  activeOrganizationCookieOptions,
} from "@/shared/organization/active-organization-cookie.const";

export async function selectActiveOrganization(organizationId: string): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const membership = await container.membership.findMembership.execute({ userId, organizationId });
  if (!membership) {
    throw new Error("Organization not found");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORGANIZATION_COOKIE, organizationId, activeOrganizationCookieOptions);
}
