import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";

export class DeleteProjectApiKeysUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(projectId: string): Promise<void> {
    await this.apiKeyRepository.deleteByProjectId(projectId);
  }
}
