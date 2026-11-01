import type { DbClient } from "@workspace/database";
import type { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import { ApiKeyMapper } from "@workspace/server/modules/api-key/entity/api-key.mapper";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

export class ApiKeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): ApiKeyService {
    return new ApiKeyService(this.apiKeyRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): ApiKeyService {
    return new ApiKeyService(this.apiKeyRepository, this.auditLogService, actor);
  }

  async saveWithAudit(apiKey: ApiKey, action: string): Promise<void> {
    await this.apiKeyRepository.save(apiKey);
    await this.auditLogService.save({
      action,
      entityType: "api-key",
      entityId: apiKey.id,
      projectId: apiKey.projectId,
      actor: this.actor,
      oldSnapshot: null,
      newSnapshot: ApiKeyMapper.toAudit(apiKey),
    });
  }
}
