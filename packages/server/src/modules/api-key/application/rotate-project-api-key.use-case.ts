import { ApiKeyFactory } from "@workspace/server/modules/api-key/entity/api-key.factory";
import type { MembershipPort } from "@workspace/server/modules/api-key/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyService } from "@workspace/server/modules/api-key/service/api-key.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  RotateProjectApiKeyInputDtoType,
  RotateProjectApiKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/rotate-project-api-key.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class RotateProjectApiKeyUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiKeyService: ApiKeyService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: RotateProjectApiKeyInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<RotateProjectApiKeyOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const project = await this.projectPort.findById(input.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const previous = await this.apiKeyRepository.findActiveByProjectId(project.id);
    const next = ApiKeyFactory.create(project.id);
    const revokedPrevious = previous ? previous.revoke(new Date()) : null;

    await this.withTransaction(async (tx) => {
      await this.apiKeyService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .replaceWithAudit(revokedPrevious, next);
    });

    return { key: next.key, createdAt: next.createdAt.toISOString() };
  }
}
