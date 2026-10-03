import { db } from "@workspace/database";
import { organizationTable } from "@workspace/database/schema";
import { inArray, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

type OrganizationInsert = InferInsertModel<typeof organizationTable>;
export type OrganizationRow = InferSelectModel<typeof organizationTable>;

export async function seedOrganization(): Promise<OrganizationRow[]> {
  const now = new Date();

  const organizationData: OrganizationInsert[] = [
    {
      id: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Acme",
      reports_retention_days: 90,
      createdAt: now,
    },
  ];

  await db.insert(organizationTable).values(organizationData).onConflictDoNothing({ target: organizationTable.id });

  return db
    .select()
    .from(organizationTable)
    .where(
      inArray(
        organizationTable.id,
        organizationData.map((organization) => organization.id),
      ),
    );
}
