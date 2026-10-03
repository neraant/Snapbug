import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type {
  FindProjectByKeyInputDtoType,
  FindProjectByKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export class FindProjectByKeyUseCase {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(input: FindProjectByKeyInputDtoType): Promise<FindProjectByKeyOutputDtoType> {
    const apiKey = await this.apiKeyRepository.findByKey(input.key);
    if (!apiKey || apiKey.revokedAt) return null;

    return await this.projectPort.findById(apiKey.projectId);
  }
}
