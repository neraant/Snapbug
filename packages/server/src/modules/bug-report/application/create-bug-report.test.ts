import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { BugReportFactory } from "@workspace/server/modules/bug-report/entity/bug-report.factory";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const actor = { type: "api-key" as const, id: null };

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
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      BugReportFactory.create({
        projectId: createInput.projectId,
        shortId: "SNB-4",
        title: createInput.title,
        description: createInput.description,
        url: createInput.url,
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = {
      withTx: vi.fn().mockReturnValue({ withActor }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new CreateBugReportUseCase(
      apiKeyPort as unknown as ApiKeyPort,
      bugReportService as unknown as BugReportService,
      withTransaction,
    );

    const result = await useCase.execute(input, actor);

    expect(apiKeyPort.findProjectByKey).toHaveBeenCalledWith({ key: input.apiKey });
    expect(withTransaction).toHaveBeenCalledOnce();
    expect(bugReportService.withTx).toHaveBeenCalledOnce();
    expect(withActor).toHaveBeenCalledWith(actor);
    expect(createWithAudit).toHaveBeenCalledWith(
      {
        organizationId,
        projectId,
        title: input.title,
        description: input.description,
        url: input.url,
      },
      "Create bug report",
    );
    const created = createWithAudit.mock.results[0]?.value;
    expect(result).toEqual(BugReportMapper.toDto(await created));
    expect(result.projectId).toBe(projectId);
    expect(result.shortId).toBe("SNB-4");
    expect(result.status).toBe(BugReportStatus.NEW);
    expect(result.severity).toBe(BugReportSeverity.MEDIUM);
    expect(result).not.toHaveProperty("screenshotKey");
  });

  it("throws when the api key is not active", async () => {
    const apiKeyPort = { findProjectByKey: vi.fn().mockResolvedValue(null) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new CreateBugReportUseCase(
      apiKeyPort as unknown as ApiKeyPort,
      bugReportService as unknown as BugReportService,
      withTransaction,
    );

    await expect(useCase.execute(input, actor)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_API_KEY,
    });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(bugReportService.withTx).not.toHaveBeenCalled();
  });
});
