import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { WidgetIngestOriginService } from "@workspace/server/modules/bug-report/service/widget-ingest-origin.service";
import { UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindWidgetConfigInputDtoType,
  FindWidgetConfigOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-widget-config.schema";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export class FindWidgetConfigUseCase {
  constructor(
    private readonly apiKeyPort: ApiKeyPort,
    private readonly projectPort: ProjectPort,
    private readonly widgetIngestOriginService: WidgetIngestOriginService,
  ) {}

  async execute(
    input: FindWidgetConfigInputDtoType,
    requestOrigin: string | null,
  ): Promise<FindWidgetConfigOutputDtoType> {
    const project = await this.apiKeyPort.findProjectByKey({ key: input.apiKey });
    if (!project) throw new UnauthorizedError(ERROR_CODES.INVALID_API_KEY);

    const widgetSetting = await this.projectPort.findWidgetSetting(project.id);
    const settings = widgetSetting ?? projectWidgetSettingModelDefaults;
    this.widgetIngestOriginService.assertAllowed(settings.allowedDomains, requestOrigin);

    const { allowedDomains: _allowedDomains, ...publicConfig } = settings;
    return publicConfig;
  }
}
