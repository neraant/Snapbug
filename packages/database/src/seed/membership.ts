import { db } from "@workspace/database";
import { membershipTable } from "@workspace/database/schema";
import type { OrganizationRow } from "@workspace/database/seed/organization";
import type { UserRow } from "@workspace/database/seed/user";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { inArray, type InferInsertModel } from "drizzle-orm";

type MembershipInsert = InferInsertModel<typeof membershipTable>;

export async function seedMembership(users: UserRow[], organizations: OrganizationRow[]) {
  const now = new Date();
  const organization = organizations[0];

  if (!organization) return;

  const membershipData: MembershipInsert[] = users.map((user, index) => ({
    id: `3a8c69a1-1ab1-45a8-8497-eae1e506d9d${index}`,
    userId: user.id,
    organizationId: organization.id,
    role: user.email === "admin@example.com" ? UserRole.ADMIN : UserRole.USER,
    createdAt: now,
  }));

  await db.insert(membershipTable).values(membershipData).onConflictDoNothing({ target: membershipTable.id });

  return db
    .select()
    .from(membershipTable)
    .where(
      inArray(
        membershipTable.id,
        membershipData.map((membership) => membership.id),
      ),
    );
}
