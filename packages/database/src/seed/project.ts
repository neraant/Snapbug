import { db } from "@workspace/database";
import { projectTable } from "@workspace/database/schema";
import type { OrganizationRow } from "@workspace/database/seed/organization";
import { inArray, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

type ProjectInsert = InferInsertModel<typeof projectTable>;
export type ProjectRow = InferSelectModel<typeof projectTable>;

export async function seedProject(organizations: OrganizationRow[]): Promise<ProjectRow[]> {
  const organization = organizations[0];

  if (!organization) return [];

  const projectData: ProjectInsert[] = [
    {
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Acme Store",
      organizationId: organization.id,
      createdAt: daysAgo(30),
    },
    {
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2",
      name: "Acme Marketing",
      organizationId: organization.id,
      createdAt: daysAgo(21),
    },
  ];

  await db.insert(projectTable).values(projectData).onConflictDoNothing({ target: projectTable.id });

  return db
    .select()
    .from(projectTable)
    .where(
      inArray(
        projectTable.id,
        projectData.map((project) => project.id),
      ),
    );
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(9, 0, 0, 0);
  return date;
}
