import { GetTicketEnvironmentUseCase } from "@workspace/server/modules/bug-report/application/get-ticket-environment.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const bugReport = new BugReport({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
  projectId,
  shortId: "SNB-2",
  assignedTo: null,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
  severity: BugReportSeverity.MEDIUM,
  title: "Layout shift",
  description: "CLS on mobile",
  stepsToReproduce: null,
  reporterEmail: null,
  reporterIp: null,
  url: "https://store.acme.test",
  userAgent: "Mozilla/5.0",
  browser: "Chrome",
  os: "macOS",
  device: "desktop",
  viewportWidth: 1280,
  viewportHeight: 720,
  screenshotKey: null,
  replayKey: null,
  hasReplay: false,
  consoleLogs: null,
  networkLogs: null,
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

describe("GetTicketEnvironmentUseCase", () => {
  it("returns environment fields for an accessible ticket", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId, role: UserRole.USER }),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new GetTicketEnvironmentUseCase(
      membershipPort as unknown as MembershipPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({ shortId: "SNB-2" }, userId);

    expect(result.browser).toBe("Chrome");
    expect(result.viewportWidth).toBe(1280);
  });
});