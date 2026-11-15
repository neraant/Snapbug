import { organizationTable } from "@workspace/database/schema/organization.const";
import { userTable } from "@workspace/database/schema/user.const";
import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { type ProjectColor, projectColorDefault } from "@workspace/validation/shared/project-color.schema";
import { boolean, jsonb, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const projectTable = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    color: text("color").$type<ProjectColor>().notNull().default(projectColorDefault),
    organizationId: uuid("organization_id")
      .references(() => organizationTable.id)
      .notNull(),
    defaultAssigneeId: uuid("default_assignee_id").references(() => userTable.id, { onDelete: "set null" }),
    storeVisitorIp: boolean("store_visitor_ip").notNull().default(false),
    collectVisitorEmail: boolean("collect_visitor_email").notNull().default(true),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "date" }),
    widgetSettings: jsonb("widget_settings").$type<ProjectWidgetSettingModelType | null>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [unique("projects_organization_slug_unique").on(table.organizationId, table.slug)],
);
