import { organizationTable } from "@workspace/database/schema/organization.const";
import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const projectTable = pgTable("projects", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationTable.id)
    .notNull(),
  widgetSettings: jsonb("widget_settings").$type<ProjectWidgetSettingModelType | null>(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});
