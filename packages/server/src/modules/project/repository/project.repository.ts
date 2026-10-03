import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import type { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";

export class ProjectRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findById(id: string): Promise<Project | null> {
    const project = await this.db.query.projectTable.findFirst({
      where: { id },
    });
    return project ? ProjectMapper.fromPersistence(project) : null;
  }

  async findManyByOrganizationId(organizationId: string): Promise<Project[]> {
    const projects = await this.db.query.projectTable.findMany({
      where: { organizationId },
    });
    return projects.map((project) => ProjectMapper.fromPersistence(project));
  }
}
