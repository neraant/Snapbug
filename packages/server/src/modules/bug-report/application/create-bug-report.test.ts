import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { BugReportFactory } from "@workspace/server/modules/bug-report/entity/bug-report.factory";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { WidgetIngestOriginService } from "@workspace/server/modules/bug-report/service/widget-ingest-origin.service";
import { WidgetIngestRateLimitService } from "@workspace/server/modules/bug-report/service/widget-ingest-rate-limit.service";
import { WidgetUserAgentService } from "@workspace/server/modules/bug-report/service/widget-user-agent.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const actor = { type: "api-key" as const, id: null };

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

const input = {
  apiKey: "ff_test_key",
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  url: "https://store.acme.test/checkout",
};

function bugReportFromCreateInput(createInput: {
  id?: string;
  projectId: string;
  shortId: string;
  title: string;
  description: string;
  url: string;
  userAgent?: string | null;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  viewportWidth?: number | null;
  viewportHeight?: number | null;
  screenshotKey?: string | null;
  replayKey?: string | null;
  consoleLogs?: unknown[] | null;
  networkLogs?: unknown[] | null;
  reporterEmail?: string | null;
  customContext?: Record<string, unknown> | null;
}) {
  return BugReportFactory.create(createInput);
}

const fileStoragePortStub: FileStoragePort = {
  saveBugReportScreenshot: vi.fn(),
  readBugReportScreenshot: vi.fn(),
  saveBugReportReplay: vi.fn(),
  readBugReportReplay: vi.fn(),
  delete: vi.fn(),
};

const widgetSettingBase = {
  position: "bottom-right" as const,
  buttonLabel: "Report a bug",
  theme: "auto" as const,
  accent: "#F97316" as const,
  privacy: {
    maskText: true,
    maskInputs: true,
    blockSelectors: [] as string[],
  },
  allowedDomains: [] as string[],
};

function createUseCase(deps: {
  apiKeyPort: ApiKeyPort;
  projectPort: ProjectPort;
  bugReportService: BugReportService;
  withTransaction: WithTransactionType;
  widgetIngestOriginService?: WidgetIngestOriginService;
  widgetUserAgentService?: WidgetUserAgentService;
  fileStoragePort?: FileStoragePort;
  widgetIngestRateLimitService?: WidgetIngestRateLimitService;
}) {
  return new CreateBugReportUseCase(
    deps.apiKeyPort,
    deps.projectPort,
    deps.bugReportService,
    deps.withTransaction,
    deps.widgetIngestOriginService ?? new WidgetIngestOriginService(),
    deps.widgetUserAgentService ?? new WidgetUserAgentService(),
    deps.fileStoragePort ?? fileStoragePortStub,
    deps.widgetIngestRateLimitService ?? new WidgetIngestRateLimitService(),
  );
}

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
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-4",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = {
      withTx: vi.fn().mockReturnValue({ withActor }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    const result = await useCase.execute(input, actor, "https://app.example.com");

    expect(apiKeyPort.findProjectByKey).toHaveBeenCalledWith({ key: input.apiKey });
    expect(projectPort.findWidgetSetting).toHaveBeenCalledWith(projectId);
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
        userAgent: null,
        browser: null,
        os: null,
        device: null,
        viewportWidth: null,
        viewportHeight: null,
        consoleLogs: null,
        networkLogs: null,
        reporterEmail: null,
        customContext: null,
        severity: BugReportSeverity.MEDIUM,
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

  it("creates a report when allowed domains is empty regardless of origin", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue({ ...widgetSettingBase, allowedDomains: [] }),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-5",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    await useCase.execute(input, actor, null);

    expect(withTransaction).toHaveBeenCalledOnce();
  });

  it("creates a report when origin host matches allowed domains", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue({
        ...widgetSettingBase,
        allowedDomains: ["app.example.com"],
      }),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-6",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    await useCase.execute(input, actor, "https://app.example.com/page");

    expect(withTransaction).toHaveBeenCalledOnce();
  });

  it("throws when origin host does not match allowed domains", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue({
        ...widgetSettingBase,
        allowedDomains: ["app.example.com"],
      }),
    };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute(input, actor, "https://other.example.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORIGIN_NOT_ALLOWED,
    });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(bugReportService.withTx).not.toHaveBeenCalled();
  });

  it("throws when allowed domains is set and origin header is missing", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue({
        ...widgetSettingBase,
        allowedDomains: ["app.example.com"],
      }),
    };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute(input, actor, null)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORIGIN_NOT_ALLOWED,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("passes env metadata and parsed user agent into createWithAudit", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-7",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    const consoleLogs = [
      {
        level: "error" as const,
        message: "snapbug-test-error",
        timestamp: "2026-10-03T09:00:00.000Z",
      },
    ];
    const networkLogs = [{ method: "GET", url: "https://store.acme.test/api/products", status: 200, durationMs: 120 }];

    await useCase.execute(
      {
        ...input,
        userAgent: CHROME_MAC,
        viewportWidth: 1440,
        viewportHeight: 900,
        consoleLogs,
        networkLogs,
      },
      actor,
      "https://app.example.com",
    );

    expect(createWithAudit).toHaveBeenCalledWith(
      {
        organizationId,
        projectId,
        title: input.title,
        description: input.description,
        url: input.url,
        userAgent: CHROME_MAC,
        browser: "Chrome 129",
        os: "macOS",
        device: "desktop",
        viewportWidth: 1440,
        viewportHeight: 900,
        consoleLogs,
        networkLogs,
        reporterEmail: null,
        customContext: null,
        severity: BugReportSeverity.MEDIUM,
      },
      "Create bug report",
    );
  });

  it("persists reporter email and custom context from the create input", async () => {
    const reporterEmail = "user@example.com";
    const customContext = { route: "/billing", plan: "pro" };
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-9",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    const result = await useCase.execute({ ...input, reporterEmail, customContext }, actor, "https://app.example.com");

    expect(createWithAudit).toHaveBeenCalledWith(
      {
        organizationId,
        projectId,
        title: input.title,
        description: input.description,
        url: input.url,
        userAgent: null,
        browser: null,
        os: null,
        device: null,
        viewportWidth: null,
        viewportHeight: null,
        consoleLogs: null,
        networkLogs: null,
        reporterEmail,
        customContext,
        severity: BugReportSeverity.MEDIUM,
      },
      "Create bug report",
    );
    expect(result.reporterEmail).toBe(reporterEmail);
    expect(result.customContext).toEqual(customContext);
  });

  it("persists screenshot key when a screenshot is provided", async () => {
    const screenshotKey = "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d901/screenshot.png";
    const saveBugReportScreenshot = vi.fn().mockResolvedValue(screenshotKey);
    const deleteScreenshot = vi.fn();
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-8",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
      fileStoragePort: {
        saveBugReportScreenshot,
        readBugReportScreenshot: vi.fn(),
        saveBugReportReplay: vi.fn(),
        readBugReportReplay: vi.fn(),
        delete: deleteScreenshot,
      },
    });

    const screenshot = { data: new Uint8Array([137, 80, 78, 71]), mimeType: "image/png" };
    const result = await useCase.execute(input, actor, "https://app.example.com", screenshot);

    expect(saveBugReportScreenshot).toHaveBeenCalledOnce();
    expect(saveBugReportScreenshot.mock.calls[0]?.[0]).toMatchObject({
      bytes: screenshot.data,
      contentType: "image/png",
      reportId: expect.any(String),
    });
    expect(createWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId,
        projectId,
        screenshotKey,
        id: saveBugReportScreenshot.mock.calls[0]?.[0].reportId,
      }),
      "Create bug report",
    );
    expect(deleteScreenshot).not.toHaveBeenCalled();
    expect(result.shortId).toBe("SNB-8");
  });

  it("throws when the api key is not active", async () => {
    const apiKeyPort = { findProjectByKey: vi.fn().mockResolvedValue(null) };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn(),
    };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute(input, actor, null)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_API_KEY,
    });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(bugReportService.withTx).not.toHaveBeenCalled();
    expect(projectPort.findWidgetSetting).not.toHaveBeenCalled();
  });

  it("maps reporter severity onto the bug report", async () => {
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-10",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    const result = await useCase.execute({ ...input, severity: "critical" }, actor, "https://app.example.com");

    expect(createWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({ severity: BugReportSeverity.CRITICAL }),
      "Create bug report",
    );
    expect(result.severity).toBe(BugReportSeverity.CRITICAL);
  });

  it("persists replay key when replay is provided", async () => {
    const replayKey = "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d901/replay.json.gz";
    const saveBugReportReplay = vi.fn().mockResolvedValue(replayKey);
    const deleteStorage = vi.fn();
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-11",
      }),
    );
    const withActor = vi.fn().mockReturnValue({ createWithAudit });
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
      fileStoragePort: {
        saveBugReportScreenshot: vi.fn(),
        readBugReportScreenshot: vi.fn(),
        saveBugReportReplay,
        readBugReportReplay: vi.fn(),
        delete: deleteStorage,
      },
    });

    const replay = { data: new Uint8Array([31, 139]), mimeType: "application/gzip" };
    const result = await useCase.execute(input, actor, "https://app.example.com", undefined, replay);

    expect(saveBugReportReplay).toHaveBeenCalledOnce();
    expect(createWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        replayKey,
        id: saveBugReportReplay.mock.calls[0]?.[0].reportId,
      }),
      "Create bug report",
    );
    expect(deleteStorage).not.toHaveBeenCalled();
    expect(result.hasReplay).toBe(true);
  });

  it("throws when replay exceeds the size limit", async () => {
    const apiKeyPort = { findProjectByKey: vi.fn() };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn(),
    };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
    });

    const replay = { data: new Uint8Array(3_000_001), mimeType: "application/gzip" };

    await expect(useCase.execute(input, actor, null, undefined, replay)).rejects.toMatchObject({
      errorCode: ERROR_CODES.REPLAY_TOO_LARGE,
    });

    expect(apiKeyPort.findProjectByKey).not.toHaveBeenCalled();
  });

  it("deletes uploaded screenshot and replay when the transaction fails", async () => {
    const screenshotKey = "bug-reports/id/screenshot.png";
    const replayKey = "bug-reports/id/replay.json.gz";
    const deleteStorage = vi.fn().mockResolvedValue(undefined);
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const bugReportService = {
      withTx: vi.fn().mockReturnValue({
        withActor: vi.fn().mockReturnValue({
          createWithAudit: vi.fn().mockRejectedValue(new Error("db failed")),
        }),
      }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
      fileStoragePort: {
        saveBugReportScreenshot: vi.fn().mockResolvedValue(screenshotKey),
        readBugReportScreenshot: vi.fn(),
        saveBugReportReplay: vi.fn().mockResolvedValue(replayKey),
        readBugReportReplay: vi.fn(),
        delete: deleteStorage,
      },
    });

    const screenshot = { data: new Uint8Array([1]), mimeType: "image/png" };
    const replay = { data: new Uint8Array([2]), mimeType: "application/gzip" };

    await expect(useCase.execute(input, actor, "https://app.example.com", screenshot, replay)).rejects.toThrow(
      "db failed",
    );

    expect(deleteStorage).toHaveBeenCalledWith(screenshotKey);
    expect(deleteStorage).toHaveBeenCalledWith(replayKey);
  });

  it("stops ingest for a project key that is over the limit and still accepts another key", async () => {
    const rateLimit = new WidgetIngestRateLimitService(1, 60_000, () => 1_700_000_000_000);
    const createWithAudit = vi.fn(async (createInput) =>
      bugReportFromCreateInput({
        ...createInput,
        shortId: "SNB-9",
      }),
    );
    const apiKeyPort = {
      findProjectByKey: vi.fn().mockResolvedValue({
        id: projectId,
        name: "Store",
        organizationId,
        createdAt: "2026-10-03T09:00:00.000Z",
      }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn().mockResolvedValue(widgetSettingBase),
    };
    const bugReportService = {
      withTx: vi.fn().mockReturnValue({
        withActor: vi.fn().mockReturnValue({ createWithAudit }),
      }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const saveBugReportScreenshot = vi.fn();
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
      bugReportService: bugReportService as unknown as BugReportService,
      withTransaction: withTransaction as WithTransactionType,
      widgetIngestRateLimitService: rateLimit,
      fileStoragePort: {
        ...fileStoragePortStub,
        saveBugReportScreenshot,
      },
    });

    await useCase.execute(input, actor, "https://app.example.com");

    await expect(
      useCase.execute(
        { ...input, title: "Second report" },
        actor,
        "https://app.example.com",
        { data: new Uint8Array([1]), mimeType: "image/png" },
      ),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.RATE_LIMITED });

    expect(createWithAudit).toHaveBeenCalledOnce();
    expect(saveBugReportScreenshot).not.toHaveBeenCalled();
    expect(projectPort.findWidgetSetting).toHaveBeenCalledOnce();

    await useCase.execute({ ...input, apiKey: "other_key" }, actor, "https://app.example.com");

    expect(createWithAudit).toHaveBeenCalledTimes(2);
  });
});
