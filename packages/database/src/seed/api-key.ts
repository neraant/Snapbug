import { db } from "@workspace/database";
import { apiKeyTable } from "@workspace/database/schema";
import type { ProjectRow } from "@workspace/database/seed/project";
import { inArray, type InferInsertModel } from "drizzle-orm";

type ApiKeyInsert = InferInsertModel<typeof apiKeyTable>;

const STORE_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const MARKETING_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";

export async function seedApiKey(projects: ProjectRow[]) {
  const projectIds = new Set(projects.map((project) => project.id));

  const apiKeyData: ApiKeyInsert[] = [
    {
      id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      projectId: STORE_PROJECT_ID,
      key: "sb_test_store_active",
      createdAt: daysAgo(28),
      revokedAt: null,
    },
    {
      id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d2",
      projectId: STORE_PROJECT_ID,
      key: "sb_test_store_revoked",
      createdAt: daysAgo(40),
      revokedAt: daysAgo(12),
    },
    {
      id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d3",
      projectId: MARKETING_PROJECT_ID,
      key: "sb_test_marketing_active",
      createdAt: daysAgo(20),
      revokedAt: null,
    },
  ].filter((apiKey) => apiKey.projectId && projectIds.has(apiKey.projectId));

  if (apiKeyData.length === 0) return [];

  for (const apiKey of apiKeyData) {
    await db
      .insert(apiKeyTable)
      .values(apiKey)
      .onConflictDoUpdate({
        target: apiKeyTable.id,
        set: {
          key: apiKey.key,
          revokedAt: apiKey.revokedAt ?? null,
        },
      });
  }

  return db
    .select()
    .from(apiKeyTable)
    .where(
      inArray(
        apiKeyTable.id,
        apiKeyData.map((apiKey) => apiKey.id),
      ),
    );
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(9, 0, 0, 0);
  return date;
}
