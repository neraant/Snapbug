import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import type { ProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import type {
  FindProjectByKeyInputDtoType,
  FindProjectByKeyOutputDtoType,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export class ApiKeyAdapter implements ApiKeyPort {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository = new ApiKeyRepository(),
    private readonly projectPort: ProjectPort = new ProjectAdapter(),
  ) {}

  async findProjectByKey(input: FindProjectByKeyInputDtoType): Promise<FindProjectByKeyOutputDtoType> {
    return await new FindProjectByKeyUseCase(this.apiKeyRepository, this.projectPort).execute(input);
  }
}
