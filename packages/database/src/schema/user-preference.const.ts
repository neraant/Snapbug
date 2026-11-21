import { userTable } from "@workspace/database/schema/user.const";
import type { UserPreferenceAccent } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import { userPreferenceAccentValues } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import type { UserPreferenceDateFormat } from "@workspace/validation/modules/preference/consts/user-preference-date-format.const";
import type { UserPreferenceDensity } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import type { UserPreferenceLandingPage } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const userPreferenceAccentDefault = userPreferenceAccentValues[0];

export const userPreferenceTable = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => userTable.id),
  timeZone: text("time_zone").notNull().default("UTC"),
  theme: text("theme").$type<UserPreferenceTheme>().notNull().default("system"),
  accent: text("accent").$type<UserPreferenceAccent>().notNull().default(userPreferenceAccentDefault),
  density: text("density").$type<UserPreferenceDensity>().notNull().default("comfortable"),
  dateFormat: text("date_format").$type<UserPreferenceDateFormat>().notNull().default("relative"),
  use24HourTime: boolean("use_24_hour_time").notNull().default(true),
  reduceMotion: boolean("reduce_motion"),
  defaultLandingPage: text("default_landing_page").$type<UserPreferenceLandingPage>().notNull().default("overview"),
  sidebarCollapsed: boolean("sidebar_collapsed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});
