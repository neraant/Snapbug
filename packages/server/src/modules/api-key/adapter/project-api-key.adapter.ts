import type { DbClient } from "@workspace/database";
import { DeleteProjectApiKeysUseCase } from "@workspace/server/modules/api-key/application/delete-project-api-keys.use-case";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ProjectApiKeyPort } from "@workspace/server/modules/project/port/api-key.port";

export class ProjectApiKeyAdapter implements ProjectApiKeyPort {
  private readonly deleteProjectApiKeys: DeleteProjectApiKeysUseCase;

  constructor(private readonly apiKeyRepository: ApiKeyRepository) {
    this.deleteProjectApiKeys = new DeleteProjectApiKeysUseCase(apiKeyRepository);
  }

  withTx(tx: unknown): ProjectApiKeyAdapter {
    return new ProjectApiKeyAdapter(this.apiKeyRepository.withTx(tx as DbClient));
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    await this.deleteProjectApiKeys.execute(projectId);
  }
}
