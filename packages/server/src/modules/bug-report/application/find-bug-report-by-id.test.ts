import { FindBugReportByIdUseCase } from "@workspace/server/modules/bug-report/application/find-bug-report-by-id.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { describe, expect, it, vi } from "vitest";

const bugReportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const bugReport = new BugReport({
  id: bugReportId,
  projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  shortId: "SNB-1",
  assignedTo: null,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
  severity: BugReportSeverity.MEDIUM,
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  stepsToReproduce: null,
  reporterEmail: "sam@shopper.test",
  url: "https://store.acme.test/checkout",
  userAgent: null,
  browser: null,
  os: null,
  device: null,
  viewportWidth: null,
  viewportHeight: null,
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

describe("FindBugReportByIdUseCase", () => {
  it("returns the public ticket without internal comments", async () => {
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const useCase = new FindBugReportByIdUseCase(bugReportRepository as unknown as BugReportRepository);

    const result = await useCase.execute(bugReportId);

    expect(result).toEqual(BugReportMapper.toDto(bugReport));
    expect(result).not.toHaveProperty("comments");
  });

  it("returns null when the ticket does not exist", async () => {
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(null) };
    const useCase = new FindBugReportByIdUseCase(bugReportRepository as unknown as BugReportRepository);

    const result = await useCase.execute(bugReportId);

    expect(result).toBeNull();
  });
});
