import { userTable } from "@workspace/database/schema/user.const";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userPreferenceTable = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => userTable.id),
  timeZone: text("time_zone").notNull().default("UTC"),
  theme: text("theme").$type<UserPreferenceTheme>().notNull().default("system"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});