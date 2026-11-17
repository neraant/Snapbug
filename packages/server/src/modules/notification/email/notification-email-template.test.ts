import { NotificationDigestEmailTemplate } from "@workspace/server/modules/notification/email/notification-digest-email-template";
import { NotificationImmediateEmailTemplate } from "@workspace/server/modules/notification/email/notification-immediate-email-template";
import { describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

function render(react: ReactElement): string {
  return renderToStaticMarkup(react).replaceAll("&#x27;", "'");
}

describe("notification email templates", () => {
  it("renders immediate email in English", () => {
    const html = render(
      NotificationImmediateEmailTemplate({
        type: "ticket.assigned",
        objectType: "bug-report",
        payload: {
          actorName: "Anna",
          ticketShortId: "SB-42",
          ticketTitle: "Login spinner",
          projectName: "Snapbug",
        },
        language: "en",
      }),
    );

    expect(html).toContain("Anna assigned you SB-42");
    expect(html).toContain("View ticket");
    expect(html).toContain("Manage notification settings");
  });

  it("renders immediate email in Russian", () => {
    const html = render(
      NotificationImmediateEmailTemplate({
        type: "ticket.assigned",
        objectType: "bug-report",
        payload: {
          actorName: "Anna",
          ticketShortId: "SB-42",
          ticketTitle: "Login spinner",
          projectName: "Snapbug",
        },
        language: "ru",
      }),
    );

    expect(html).toContain("назначил");
    expect(html).toContain("Открыть тикет");
    expect(html).toContain("Настройки уведомлений");
  });

  it("renders digest email in both languages", () => {
    const items = [
      {
        id: "1",
        userId: "u",
        organizationId: "o",
        type: "ticket.assigned" as const,
        actorUserId: null,
        objectType: "bug-report" as const,
        objectId: "t1",
        projectId: "p1",
        payload: { projectName: "Alpha", ticketShortId: "SB-1" },
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ];

    const en = render(
      NotificationDigestEmailTemplate({
        groups: [{ projectKey: "p1", projectName: "Alpha", items }],
        language: "en",
      }),
    );
    const ru = render(
      NotificationDigestEmailTemplate({
        groups: [{ projectKey: "p1", projectName: "Alpha", items }],
        language: "ru",
      }),
    );

    expect(en).toContain("Your notification digest");
    expect(ru).toContain("Дайджест уведомлений");
  });
});