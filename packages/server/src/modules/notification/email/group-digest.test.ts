import { groupDigestByProject } from "@workspace/server/modules/notification/email/group-digest.util";
import { describe, expect, it } from "vitest";

describe("groupDigestByProject", () => {
  it("groups digest items by project", () => {
    const grouped = groupDigestByProject(
      [
        {
          id: "1",
          userId: "u",
          organizationId: "o",
          type: "ticket.assigned",
          actorUserId: null,
          objectType: "bug-report",
          objectId: "t1",
          projectId: "p1",
          payload: { projectName: "Alpha", ticketShortId: "SB-1" },
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "2",
          userId: "u",
          organizationId: "o",
          type: "comment.created",
          actorUserId: null,
          objectType: "bug-report",
          objectId: "t2",
          projectId: "p1",
          payload: { projectName: "Alpha", ticketShortId: "SB-2" },
          createdAt: new Date("2026-01-01T00:01:00.000Z"),
        },
        {
          id: "3",
          userId: "u",
          organizationId: "o",
          type: "ticket.created",
          actorUserId: null,
          objectType: "bug-report",
          objectId: "t3",
          projectId: "p2",
          payload: { projectName: "Beta", ticketShortId: "SB-3" },
          createdAt: new Date("2026-01-01T00:02:00.000Z"),
        },
      ],
      "en",
    );

    expect(grouped).toHaveLength(2);
    expect(grouped[0]?.projectName).toBe("Alpha");
    expect(grouped[0]?.items).toHaveLength(2);
    expect(grouped[1]?.projectName).toBe("Beta");
  });
});