import { projectTable } from "@workspace/database/schema/project.const";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const apiKeyTable = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey(),
    projectId: uuid("project_id")
      .references(() => projectTable.id)
      .notNull(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [unique("key_unique").on(table.key)],
);
