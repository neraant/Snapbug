import { container } from "@workspace/server/container";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { cookies } from "next/headers";
import { cache } from "react";

import {
  ACTIVE_ORGANIZATION_COOKIE,
  activeOrganizationCookieOptions,
} from "@/shared/organization/active-organization-cookie.const";

export type ActiveOrganization = {
  organizationId: string;
  role: UserRole;
};

export function chooseActiveMembership<TMembership extends { organizationId: string }>(
  memberships: readonly TMembership[],
  cookieOrganizationId: string | undefined,
): TMembership | undefined {
  const newestMembership = memberships[0];
  if (!newestMembership) return undefined;

  return memberships.find((membership) => membership.organizationId === cookieOrganizationId) ?? newestMembership;
}

async function resolveActiveOrganizationUncached(
  userId: string,
  writeCookie = false,
): Promise<ActiveOrganization | null> {
  const memberships = await container.membership.findMembershipsByUser.execute(userId);
  const cookieStore = await cookies();
  const cookieOrganizationId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;
  const active = chooseActiveMembership(memberships, cookieOrganizationId);
  if (!active) return null;

  if (writeCookie && active.organizationId !== cookieOrganizationId) {
    try {
      cookieStore.set(ACTIVE_ORGANIZATION_COOKIE, active.organizationId, activeOrganizationCookieOptions);
    } catch {
      // Server Component render cannot write cookies. The same newest-membership fallback still applies.
    }
  }

  return { organizationId: active.organizationId, role: active.role };
}

export const resolveActiveOrganization = cache(resolveActiveOrganizationUncached);
