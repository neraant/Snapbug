import "@workspace/database/env/load-root-env";

import { db } from "@workspace/database";
import { bugReportTable, notificationTable, projectTable, userTable } from "@workspace/database/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "admin@example.com";
const ORGANIZATION_ID = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const TICKET_ID = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";
const NOTIFICATION_ID = "7a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

async function main(): Promise<void> {
  const [admin] = await db.select().from(userTable).where(eq(userTable.email, ADMIN_EMAIL)).limit(1);
  if (!admin) {
    throw new Error(`Seed user ${ADMIN_EMAIL} not found`);
  }

  const [alice] = await db.select().from(userTable).where(eq(userTable.email, "alice@example.com")).limit(1);

  const [ticket] = await db.select().from(bugReportTable).where(eq(bugReportTable.id, TICKET_ID)).limit(1);
  if (!ticket) {
    throw new Error("Seed ticket not found");
  }

  const [project] = await db.select().from(projectTable).where(eq(projectTable.id, ticket.projectId)).limit(1);

  const now = new Date();

  await db
    .insert(notificationTable)
    .values({
      id: NOTIFICATION_ID,
      organizationId: ORGANIZATION_ID,
      recipientUserId: admin.id,
      type: "ticket.assigned",
      actorUserId: alice?.id ?? null,
      objectType: "bug-report",
      objectId: TICKET_ID,
      projectId: ticket.projectId,
      payload: {
        ticketShortId: ticket.shortId,
        ticketTitle: ticket.title,
        projectName: project?.name ?? "Store",
        actorName: alice?.name ?? "Alice",
      },
      readAt: null,
      archivedAt: null,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: notificationTable.id,
      set: {
        readAt: null,
        archivedAt: null,
        createdAt: now,
      },
    });

  process.stdout.write(`${JSON.stringify({ ticketShortId: ticket.shortId })}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
