import { organizationTable } from "@workspace/database/schema/organization.const";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const projectTable = pgTable("projects", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationTable.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});
