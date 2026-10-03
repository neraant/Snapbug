import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const organizationTable = pgTable("organizations", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  reports_retention_days: integer("reports_retention_days").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});
