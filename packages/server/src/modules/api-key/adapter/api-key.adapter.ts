import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type {
  FindProjectByKeyInputDtoType,
  FindProjectByKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export class ApiKeyAdapter implements ApiKeyPort {
  private readonly findProjectByKeyUseCase: FindProjectByKeyUseCase;

  constructor(apiKeyRepository: ApiKeyRepository, projectPort: ProjectPort) {
    this.findProjectByKeyUseCase = new FindProjectByKeyUseCase(apiKeyRepository, projectPort);
  }

  async findProjectByKey(input: FindProjectByKeyInputDtoType): Promise<FindProjectByKeyOutputDtoType> {
    return await this.findProjectByKeyUseCase.execute(input);
  }
}
