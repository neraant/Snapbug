import { FindScreenshotUseCase } from "@workspace/server/modules/bug-report/application/find-screenshot.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const createdAt = new Date("2026-10-03T09:00:00.000Z");
const screenshotKey = "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d901/screenshot.png";

const membership = {
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const bugReport = new BugReport({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
  projectId,
  shortId: "SNB-1",
  assignedTo: null,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
  severity: BugReportSeverity.MEDIUM,
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  stepsToReproduce: null,
  reporterEmail: null,
  url: "https://store.acme.test/checkout",
  userAgent: null,
  browser: null,
  os: null,
  device: null,
  viewportWidth: null,
  viewportHeight: null,
  screenshotKey,
  replayKey: null,
  hasReplay: false,
  consoleLogs: null,
  networkLogs: null,
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

describe("FindScreenshotUseCase", () => {
  it("returns screenshot bytes for a member", async () => {
    const bytes = new Uint8Array([137, 80, 78, 71]);
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const bugReportRepository = {
      findByShortIdAndOrganizationId: vi.fn().mockResolvedValue(bugReport),
    };
    const fileStoragePort = {
      readBugReportScreenshot: vi.fn().mockResolvedValue({ bytes, contentType: "image/png" }),
    };
    const useCase = new FindScreenshotUseCase(
      membershipPort as unknown as MembershipPort,
      bugReportRepository as unknown as BugReportRepository,
      fileStoragePort as unknown as FileStoragePort,
    );

    const result = await useCase.execute({ shortId: "SNB-1" }, userId);

    expect(bugReportRepository.findByShortIdAndOrganizationId).toHaveBeenCalledWith("SNB-1", organizationId);
    expect(fileStoragePort.readBugReportScreenshot).toHaveBeenCalledWith(screenshotKey);
    expect(result).toEqual({ bytes, contentType: "image/png" });
  });

  it("throws when the bug report has no screenshot", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const bugReportWithoutScreenshot = new BugReport({
      id: bugReport.id,
      projectId,
      shortId: "SNB-1",
      assignedTo: null,
      status: BugReportStatus.NEW,
      boardOrder: 1024,
      severity: BugReportSeverity.MEDIUM,
      title: "Pay button throws",
      description: "Clicking Pay shows a blank page.",
      stepsToReproduce: null,
      reporterEmail: null,
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
    const bugReportRepository = {
      findByShortIdAndOrganizationId: vi.fn().mockResolvedValue(bugReportWithoutScreenshot),
    };
    const fileStoragePort = { readBugReportScreenshot: vi.fn() };
    const useCase = new FindScreenshotUseCase(
      membershipPort as unknown as MembershipPort,
      bugReportRepository as unknown as BugReportRepository,
      fileStoragePort as unknown as FileStoragePort,
    );

    await expect(useCase.execute({ shortId: "SNB-1" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(fileStoragePort.readBugReportScreenshot).not.toHaveBeenCalled();
  });
});
