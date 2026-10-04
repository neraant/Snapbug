import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [unique("email_unique").on(table.email)],
);
