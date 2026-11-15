import { db } from "@workspace/database";
import { userTable } from "@workspace/database/schema";
import bcrypt from "bcryptjs";
import { inArray, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

const SEED_PASSWORD_ROUNDS = 12;

type UserInsert = InferInsertModel<typeof userTable>;
export type UserRow = InferSelectModel<typeof userTable>;

export async function seedUser(): Promise<UserRow[]> {
  const passwordHash = await bcrypt.hash("password", SEED_PASSWORD_ROUNDS);
  const now = new Date();

  const userData: UserInsert[] = [
    {
      id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d3",
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      email: "alice@example.com",
      name: "Alice",
      passwordHash,
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      email: "bob@example.com",
      name: "Bob",
      passwordHash,
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db
    .insert(userTable)
    .values(userData.map((user) => ({ ...user, interfaceLanguage: "en" as const })))
    .onConflictDoUpdate({
      target: userTable.email,
      set: { interfaceLanguage: "en" },
    });

  return db
    .select()
    .from(userTable)
    .where(
      inArray(
        userTable.email,
        userData.map((user) => user.email),
      ),
    );
}
