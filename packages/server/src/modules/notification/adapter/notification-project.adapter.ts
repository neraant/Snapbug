import type { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import type { NotificationProjectPort } from "@workspace/server/modules/notification/port/project.port";

export class NotificationProjectAdapter implements NotificationProjectPort {
  constructor(private readonly projectAdapter: ProjectAdapter) {}

  async findById(id: string) {
    return await this.projectAdapter.findById(id);
  }

  async findManyByOrganizationId(input: { organizationId: string }) {
    return await this.projectAdapter.findManyByOrganizationId(input);
  }
}
