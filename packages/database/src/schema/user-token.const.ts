import { userTable } from "@workspace/database/schema/user.const";
import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const userTokenTable = pgTable(
  "user_tokens",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => userTable.id)
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    prefix: text("prefix").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [unique("user_token_hash_unique").on(table.tokenHash), index("user_tokens_user_id_idx").on(table.userId)],
);
