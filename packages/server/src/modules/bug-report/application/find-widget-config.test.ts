import { FindWidgetConfigUseCase } from "@workspace/server/modules/bug-report/application/find-widget-config.use-case";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import { WidgetIngestOriginService } from "@workspace/server/modules/bug-report/service/widget-ingest-origin.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

const input = { apiKey: "ff_test_key" };

const widgetSettingBase = {
  position: "bottom-left" as const,
  buttonLabel: "Feedback",
  theme: "dark" as const,
  accent: "#3B82F6" as const,
  background: "#1E293B" as const,
  text: "#F8FAFC" as const,
  mutedText: "#94A3B8" as const,
  font: "monospace" as const,
  privacy: {
    maskText: true,
    maskInputs: false,
    blockSelectors: [".secret"],
  },
  allowedDomains: [] as string[],
};

function createUseCase(deps: {
  apiKeyPort: ApiKeyPort;
  projectPort: ProjectPort;
  widgetIngestOriginService?: WidgetIngestOriginService;
}) {
  return new FindWidgetConfigUseCase(
    deps.apiKeyPort,
    deps.projectPort,
    deps.widgetIngestOriginService ?? new WidgetIngestOriginService(),
  );
}

describe("FindWidgetConfigUseCase", () => {
  it("returns widget settings without allowedDomains for a valid api key", async () => {
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
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
    });

    const result = await useCase.execute(input, "https://app.example.com");

    expect(result).toEqual({
      position: "bottom-left",
      buttonLabel: "Feedback",
      theme: "dark",
      accent: "#3B82F6",
      background: "#1E293B",
      text: "#F8FAFC",
      mutedText: "#94A3B8",
      font: "monospace",
      privacy: widgetSettingBase.privacy,
    });
    expect(result).not.toHaveProperty("allowedDomains");
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
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
    });

    await expect(useCase.execute(input, "https://other.example.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORIGIN_NOT_ALLOWED,
    });
  });

  it("throws when the api key is not active", async () => {
    const apiKeyPort = { findProjectByKey: vi.fn().mockResolvedValue(null) };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn(),
      findWidgetSetting: vi.fn(),
    };
    const useCase = createUseCase({
      apiKeyPort: apiKeyPort as unknown as ApiKeyPort,
      projectPort: projectPort as unknown as ProjectPort,
    });

    await expect(useCase.execute(input, null)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_API_KEY,
    });

    expect(projectPort.findWidgetSetting).not.toHaveBeenCalled();
  });
});
