import type { CheckUserProjectAccessUseCase } from "@workspace/server/modules/membership/application/check-user-project-access.use-case";
import type { ProjectAccessPort } from "@workspace/server/modules/project/port/project-access.port";

export class ProjectAccessAdapter implements ProjectAccessPort {
  private readonly checkUserProjectAccess: CheckUserProjectAccessUseCase;

  constructor(checkUserProjectAccess: CheckUserProjectAccessUseCase) {
    this.checkUserProjectAccess = checkUserProjectAccess;
  }

  async userHasProjectAccess(userId: string, projectId: string, organizationId: string): Promise<boolean> {
    return await this.checkUserProjectAccess.execute(userId, projectId, organizationId);
  }
}
