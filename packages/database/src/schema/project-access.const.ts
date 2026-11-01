import { membershipTable } from "@workspace/database/schema/membership.const";
import { projectTable } from "@workspace/database/schema/project.const";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const projectAccessTable = pgTable("project_accesses", {
  id: uuid("id").primaryKey(),
  membershipId: uuid("membership_id")
    .references(() => membershipTable.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projectTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});
