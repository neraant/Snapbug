import { projectTable } from "@workspace/database/schema/project.const";
import { userTable } from "@workspace/database/schema/user.const";
import { bugReportSeverities } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { bugReportStatuses } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const bugReportTable = pgTable("bug_reports", {
  id: uuid("id").primaryKey(),
  projectId: uuid("project_id")
    .references(() => projectTable.id)
    .notNull(),
  shortId: text("short_id").notNull(),
  assignedTo: uuid("assigned_to").references(() => userTable.id, { onDelete: "set null" }),
  status: text("status", { enum: bugReportStatuses }).notNull(),
  severity: text("severity", { enum: bugReportSeverities }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stepsToReproduce: text("steps_to_reproduce"),
  reporterEmail: text("reporter_email"),
  url: text("url"),
  userAgent: text("user_agent"),
  browser: text("browser"),
  os: text("os"),
  device: text("device"),
  viewportWidth: integer("viewport_width"),
  viewportHeight: integer("viewport_height"),
  screenshotKey: text("screenshot_key"),
  hasReplay: boolean("has_replay").notNull().default(false),
  consoleLogs: jsonb("console_logs").$type<unknown[]>(),
  networkLogs: jsonb("network_logs").$type<unknown[]>(),
  customContext: jsonb("custom_context").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "date" }),
});
