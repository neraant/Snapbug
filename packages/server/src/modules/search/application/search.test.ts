import { SearchUseCase } from "@workspace/server/modules/search/application/search.use-case";
import type { BugReportPort } from "@workspace/server/modules/search/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/search/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/search/port/project.port";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const hiddenProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";
const hiddenTicketId = "6a8c69a1-1ab1-45a8-8497-eae1e506d902";

const membership = {
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const project = {
  id: projectId,
  name: "Acme Store",
  color: "blue" as const,
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const hiddenProject = {
  id: hiddenProjectId,
  name: "Acme Marketing",
  color: "green" as const,
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

describe("SearchUseCase", () => {
  it("returns matching projects and tickets only from projects the member can access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project, hiddenProject]),
    };
    const bugReportPort = {
      findManyForSearch: vi.fn().mockResolvedValue([
        {
          id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
          shortId: "SNB-1",
          title: "Pay button throws",
          projectId,
        },
      ]),
    };
    const useCase = new SearchUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportPort as unknown as BugReportPort,
    );

    const result = await useCase.execute({ query: "pay" }, userId, organizationId);

    expect(bugReportPort.findManyForSearch).toHaveBeenCalledWith([projectId], "pay", 10);
    expect(result.projects).toEqual([]);
    expect(result.tickets).toEqual([
      {
        id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
        shortId: "SNB-1",
        title: "Pay button throws",
        projectId,
        projectName: "Acme Store",
      },
    ]);
    expect(result.projects.some((item) => item.id === hiddenProjectId)).toBe(false);
  });

  it("does not search tickets in a project the member cannot access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project, hiddenProject]),
    };
    const bugReportPort = {
      findManyForSearch: vi.fn().mockResolvedValue([]),
    };
    const useCase = new SearchUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportPort as unknown as BugReportPort,
    );

    const result = await useCase.execute({ query: "Acme Marketing" }, userId, organizationId);

    expect(bugReportPort.findManyForSearch).toHaveBeenCalledWith([projectId], "Acme Marketing", 10);
    expect(result.projects).toEqual([]);
    expect(result.tickets).toEqual([]);
    expect(result.tickets.some((ticket) => ticket.id === hiddenTicketId)).toBe(false);
  });
});