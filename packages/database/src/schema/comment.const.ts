import { bugReportTable } from "@workspace/database/schema/bug-report.const";
import { userTable } from "@workspace/database/schema/user.const";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const commentTable = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey(),
    bugReportId: uuid("bug_report_id")
      .references(() => bugReportTable.id, { onDelete: "cascade" })
      .notNull(),
    authorUserId: uuid("author_user_id")
      .references(() => userTable.id)
      .notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [index("comments_bug_report_id_created_at_idx").on(table.bugReportId, table.createdAt)],
);
