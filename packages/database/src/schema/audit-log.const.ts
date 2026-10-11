import { projectTable } from "@workspace/database/schema/project.const";
import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const auditActorTypes = ["user", "api-key", "mcp"] as const;

export type AuditLogChangesType = Record<string, { from: unknown; to: unknown }>;

export const auditLogTable = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey(),
    action: text("action").notNull(),
    actorType: text("actor_type", { enum: auditActorTypes }),
    actorId: uuid("actor_id"),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    projectId: uuid("project_id")
      .references(() => projectTable.id)
      .notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
    changes: jsonb("changes").$type<AuditLogChangesType>().notNull(),
  },
  (table) => [index("audit_logs_project_action_occurred_at_idx").on(table.projectId, table.action, table.occurredAt)],
);
