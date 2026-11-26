import "@workspace/database/env/load-root-env";

import { createHash } from "node:crypto";

import { db, pool } from "@workspace/database";
import {
  bugReportTable,
  invitationTable,
  membershipTable,
  organizationTable,
  projectAccessTable,
  projectTable,
  resetPasswordTokenTable,
  userTable,
  userTokenTable,
} from "@workspace/database/schema";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { projectColorDefault } from "@workspace/validation/shared/project-color.schema";
import { and, eq, sql } from "drizzle-orm";

const ADMIN_EMAIL = "admin@example.com";
const ALICE_EMAIL = "alice@example.com";
const BOB_EMAIL = "bob@example.com";
const CAROL_EMAIL = "carol@example.com";

const ACME_ORGANIZATION_ID = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const STORE_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const MARKETING_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";

const FOREIGN_ORGANIZATION_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e1";
const FOREIGN_USER_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e2";
const FOREIGN_MEMBERSHIP_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e3";
const FOREIGN_PROJECT_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e4";
const FOREIGN_PROJECT_ACCESS_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e5";
const FOREIGN_TICKET_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e6";
const LONG_TICKET_ID = "8a8c69a1-1ab1-45a8-8497-eae1e506d9e7";

const READ_ONLY_TOKEN_ID = "9a8c69a1-1ab1-45a8-8497-eae1e506d9e1";
const REVOKED_TOKEN_ID = "9a8c69a1-1ab1-45a8-8497-eae1e506d9e2";

const PENDING_RESET_TOKEN = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1";
const EXPIRED_RESET_TOKEN = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2";

const READ_ONLY_MCP_TOKEN = "snb_ut_live_e2ereadonlytoken";
const REVOKED_MCP_TOKEN = "snb_ut_live_e2erevokedtoken";
const USER_TOKEN_PREFIX = "snb_ut_live_";

const FOREIGN_SHORT_ID = "SNB-99";
const FOREIGN_TITLE = "Foreign invoice total is wrong";
const LONG_SHORT_ID = "SNB-80";
const LONG_TITLE = "Unbroken description stays in the column";
const ALLOWED_WIDGET_HOST = "widget.example";

const READ_ONLY_SCOPES = ["tickets:read", "comments:read", "projects:read", "members:read", "stats:read"];

function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

function displayPrefix(secret: string): string {
  return secret.slice(0, USER_TOKEN_PREFIX.length + 4);
}

function write(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

async function prepare(): Promise<void> {
  const [admin] = await db.select().from(userTable).where(eq(userTable.email, ADMIN_EMAIL)).limit(1);
  const [alice] = await db.select().from(userTable).where(eq(userTable.email, ALICE_EMAIL)).limit(1);
  const [bob] = await db.select().from(userTable).where(eq(userTable.email, BOB_EMAIL)).limit(1);
  if (!admin || !alice || !bob) {
    throw new Error("Seed users are missing. Run the database seed first.");
  }

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const hourAhead = new Date(now.getTime() + 60 * 60 * 1000);

  await db
    .insert(organizationTable)
    .values({
      id: FOREIGN_ORGANIZATION_ID,
      name: "Other Org",
      reports_retention_days: 90,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: organizationTable.id,
      set: { name: "Other Org" },
    });

  await db
    .insert(userTable)
    .values({
      id: FOREIGN_USER_ID,
      email: CAROL_EMAIL,
      name: "Carol",
      passwordHash: admin.passwordHash,
      interfaceLanguage: "en",
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userTable.email,
      set: { name: "Carol", passwordHash: admin.passwordHash, onboardingCompletedAt: now },
    });

  await db
    .insert(membershipTable)
    .values({
      id: FOREIGN_MEMBERSHIP_ID,
      userId: FOREIGN_USER_ID,
      organizationId: FOREIGN_ORGANIZATION_ID,
      role: UserRole.ADMIN,
      createdAt: now,
    })
    .onConflictDoNothing({ target: membershipTable.id });

  await db
    .insert(projectTable)
    .values({
      id: FOREIGN_PROJECT_ID,
      name: "Other Store",
      slug: "other-store",
      color: projectColorDefault,
      organizationId: FOREIGN_ORGANIZATION_ID,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: projectTable.id,
      set: { name: "Other Store", slug: "other-store", archivedAt: null },
    });

  await db
    .insert(projectAccessTable)
    .values({
      id: FOREIGN_PROJECT_ACCESS_ID,
      membershipId: FOREIGN_MEMBERSHIP_ID,
      projectId: FOREIGN_PROJECT_ID,
      createdAt: now,
    })
    .onConflictDoNothing({ target: projectAccessTable.id });

  const foreignTicket = {
    id: FOREIGN_TICKET_ID,
    projectId: FOREIGN_PROJECT_ID,
    shortId: FOREIGN_SHORT_ID,
    status: BugReportStatus.NEW,
    boardOrder: 1000,
    severity: BugReportSeverity.HIGH,
    title: FOREIGN_TITLE,
    description: "The invoice from the other organization must stay hidden.",
    stepsToReproduce: "1. Open the foreign invoice.",
    url: "https://other.example/invoice",
    hasReplay: false,
    createdAt: hourAgo,
    updatedAt: hourAgo,
  };

  await db
    .insert(bugReportTable)
    .values(foreignTicket)
    .onConflictDoUpdate({
      target: bugReportTable.id,
      set: {
        title: foreignTicket.title,
        description: foreignTicket.description,
        stepsToReproduce: foreignTicket.stepsToReproduce,
        shortId: foreignTicket.shortId,
        status: foreignTicket.status,
      },
    });

  const longDescription = "A".repeat(800);
  await db
    .insert(bugReportTable)
    .values({
      id: LONG_TICKET_ID,
      projectId: STORE_PROJECT_ID,
      shortId: LONG_SHORT_ID,
      status: BugReportStatus.NEW,
      boardOrder: 900,
      severity: BugReportSeverity.LOW,
      title: LONG_TITLE,
      description: longDescription,
      stepsToReproduce: "1. Open the ticket.\n2. Read the description.",
      url: "https://store.acme.test/long",
      hasReplay: false,
      createdAt: hourAgo,
      updatedAt: hourAgo,
    })
    .onConflictDoUpdate({
      target: bugReportTable.id,
      set: { title: LONG_TITLE, description: longDescription, status: BugReportStatus.NEW },
    });

  await db
    .update(projectTable)
    .set({
      widgetSettings: {
        ...projectWidgetSettingModelDefaults,
        allowedDomains: [ALLOWED_WIDGET_HOST],
      },
    })
    .where(eq(projectTable.id, MARKETING_PROJECT_ID));

  await db.delete(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.userId, bob.id));
  await db.delete(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.userId, alice.id));
  await db.insert(resetPasswordTokenTable).values([
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3",
      userId: bob.id,
      token: PENDING_RESET_TOKEN,
      expiresAt: hourAhead,
    },
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4",
      userId: alice.id,
      token: EXPIRED_RESET_TOKEN,
      expiresAt: hourAgo,
    },
  ]);

  const tokenRows = [
    {
      id: READ_ONLY_TOKEN_ID,
      secret: READ_ONLY_MCP_TOKEN,
      name: "E2E read only",
      revokedAt: null,
    },
    {
      id: REVOKED_TOKEN_ID,
      secret: REVOKED_MCP_TOKEN,
      name: "E2E revoked",
      revokedAt: hourAgo,
    },
  ];

  for (const token of tokenRows) {
    await db
      .insert(userTokenTable)
      .values({
        id: token.id,
        userId: admin.id,
        tokenHash: hashSecret(token.secret),
        name: token.name,
        prefix: displayPrefix(token.secret),
        scopes: READ_ONLY_SCOPES,
        scopePreset: "readOnly",
        projectIds: null,
        createdAt: now,
        revokedAt: token.revokedAt,
      })
      .onConflictDoUpdate({
        target: userTokenTable.id,
        set: {
          tokenHash: hashSecret(token.secret),
          name: token.name,
          prefix: displayPrefix(token.secret),
          scopes: READ_ONLY_SCOPES,
          scopePreset: "readOnly",
          revokedAt: token.revokedAt,
          userId: admin.id,
        },
      });
  }

  const [aliceMembership] = await db
    .select()
    .from(membershipTable)
    .where(and(eq(membershipTable.userId, alice.id), eq(membershipTable.organizationId, ACME_ORGANIZATION_ID)))
    .limit(1);

  const titled = await db
    .select({ id: bugReportTable.id, shortId: bugReportTable.shortId, title: bugReportTable.title })
    .from(bugReportTable)
    .where(eq(bugReportTable.projectId, STORE_PROJECT_ID));

  const pay = titled.find((ticket) => ticket.title.startsWith("Pay button throws"));
  const discount = titled.find((ticket) => ticket.title.startsWith("Discount code SAVE10"));
  if (!pay || !discount || !aliceMembership) {
    throw new Error("Expected Acme tickets or Alice's membership are missing.");
  }

  write({
    foreignTicketId: FOREIGN_TICKET_ID,
    foreignShortId: FOREIGN_SHORT_ID,
    foreignTitle: FOREIGN_TITLE,
    foreignProjectId: FOREIGN_PROJECT_ID,
    longTicketShortId: LONG_SHORT_ID,
    longTicketTitle: LONG_TITLE,
    payTicketId: pay.id,
    payShortId: pay.shortId,
    discountTicketId: discount.id,
    discountShortId: discount.shortId,
    aliceMembershipId: aliceMembership.id,
    acmeOrganizationId: ACME_ORGANIZATION_ID,
    storeProjectId: STORE_PROJECT_ID,
    marketingProjectId: MARKETING_PROJECT_ID,
    allowedWidgetHost: ALLOWED_WIDGET_HOST,
    pendingResetToken: PENDING_RESET_TOKEN,
    expiredResetToken: EXPIRED_RESET_TOKEN,
    readOnlyMcpToken: READ_ONLY_MCP_TOKEN,
    revokedMcpToken: REVOKED_MCP_TOKEN,
    bobEmail: BOB_EMAIL,
    aliceEmail: ALICE_EMAIL,
  });
}

async function tokenStatus(email: string): Promise<void> {
  const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
  if (!user) {
    write({ exists: false });
    return;
  }

  const [token] = await db
    .select({ id: resetPasswordTokenTable.id })
    .from(resetPasswordTokenTable)
    .where(eq(resetPasswordTokenTable.userId, user.id))
    .limit(1);
  write({ exists: Boolean(token) });
}

async function ticket(id: string): Promise<void> {
  const [row] = await db
    .select({ status: bugReportTable.status, title: bugReportTable.title })
    .from(bugReportTable)
    .where(eq(bugReportTable.id, id))
    .limit(1);
  write(row ?? { status: null, title: null });
}

async function countTitle(title: string): Promise<void> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bugReportTable)
    .where(eq(bugReportTable.title, title));
  write({ count: Number(row?.count ?? 0) });
}

async function invitationCount(email: string): Promise<void> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(invitationTable)
    .where(eq(invitationTable.email, email));
  write({ count: Number(row?.count ?? 0) });
}

async function main(): Promise<void> {
  const [command, argument] = process.argv.slice(2);
  if (command === "prepare") {
    await prepare();
    return;
  }
  if (command === "token-status" && argument) {
    await tokenStatus(argument);
    return;
  }
  if (command === "ticket" && argument) {
    await ticket(argument);
    return;
  }
  if (command === "count-title" && argument) {
    await countTitle(argument);
    return;
  }
  if (command === "invitation-count" && argument) {
    await invitationCount(argument);
    return;
  }
  throw new Error(`Unknown e2e access command: ${command ?? "(missing)"}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
