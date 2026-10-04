import { userTable } from "@workspace/database/schema/user.const";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const resetPasswordTokenTable = pgTable("reset_password_tokens", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});
