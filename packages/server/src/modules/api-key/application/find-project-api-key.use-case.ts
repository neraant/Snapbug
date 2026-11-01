import { ApiKeyFactory } from "@workspace/server/modules/api-key/entity/api-key.factory";
import { ApiKeyMapper } from "@workspace/server/modules/api-key/entity/api-key.mapper";
import type { MembershipPort } from "@workspace/server/modules/api-key/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyService } from "@workspace/server/modules/api-key/service/api-key.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindProjectApiKeyInputDtoType,
  FindProjectApiKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-api-key.schema";

export class FindProjectApiKeyUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyService: ApiKeyService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: FindProjectApiKeyInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindProjectApiKeyOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = await this.projectPort.findById(input.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    let apiKey = await this.apiKeyRepository.findActiveByProjectId(project.id);
    if (!apiKey) {
      const createdApiKey = ApiKeyFactory.create(project.id);
      await this.withTransaction(async (tx) => {
        await this.apiKeyService
          .withTx(tx)
          .withActor({ type: "user", id: userId })
          .saveWithAudit(createdApiKey, "Create API key");
      });
      apiKey = createdApiKey;
    }

    return ApiKeyMapper.toProjectApiKeyDto(apiKey);
  }
}
