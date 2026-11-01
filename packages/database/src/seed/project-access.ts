import { db } from "@workspace/database";
import { projectAccessTable } from "@workspace/database/schema";
import { randomUUID } from "crypto";

type ProjectAccessSeedMembership = {
  id: string;
  organizationId: string;
};

type ProjectAccessSeedProject = {
  id: string;
  organizationId: string;
};

export async function seedProjectAccess(
  memberships: ProjectAccessSeedMembership[],
  projects: ProjectAccessSeedProject[],
) {
  const createdAt = new Date();
  const rows = memberships.flatMap((membership) =>
    projects
      .filter((project) => project.organizationId === membership.organizationId)
      .map((project) => ({
        id: randomUUID(),
        membershipId: membership.id,
        projectId: project.id,
        createdAt,
      })),
  );

  if (rows.length === 0) return;

  const existing = await db.query.projectAccessTable.findMany();
  const granted = new Set(existing.map((row) => `${row.membershipId}:${row.projectId}`));
  const missing = rows.filter((row) => !granted.has(`${row.membershipId}:${row.projectId}`));
  if (missing.length === 0) return;

  await db.insert(projectAccessTable).values(missing);
}
