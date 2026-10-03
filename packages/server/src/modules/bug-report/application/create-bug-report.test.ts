import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

const input = {
  apiKey: "ff_test_key",
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  url: "https://store.acme.test/checkout",
};

describe("CreateBugReportUseCase", () => {
  it("creates a new bug report for an active api key", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const bugReportRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const useCase = new CreateBugReportUseCase(
      apiKeyPort as unknown as ApiKeyPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute(input);

    expect(apiKeyPort.findProjectByKey).toHaveBeenCalledWith({ key: input.apiKey });
    expect(bugReportRepository.save).toHaveBeenCalledOnce();
    const saved = bugReportRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(BugReportMapper.toDto(saved));
    expect(result.projectId).toBe(projectId);
    expect(result.status).toBe(BugReportStatus.NEW);
    expect(result.severity).toBe(BugReportSeverity.MEDIUM);
    expect(result).not.toHaveProperty("screenshotKey");
  });

  it("throws when the api key is not active", async () => {
    const apiKeyPort = { findProjectByKey: vi.fn().mockResolvedValue(null) };
    const bugReportRepository = { save: vi.fn() };
    const useCase = new CreateBugReportUseCase(
      apiKeyPort as unknown as ApiKeyPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_API_KEY,
    });

    expect(bugReportRepository.save).not.toHaveBeenCalled();
  });
});
