import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { projectTable } from "@workspace/database/schema";
import type { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export class ProjectRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): ProjectRepository {
    return new ProjectRepository(tx);
  }

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

  async save(project: Project): Promise<void> {
    const values = ProjectMapper.toPersistence(project);

    try {
      await this.db
        .insert(projectTable)
        .values({
          id: values.id,
          name: values.name,
          organizationId: values.organizationId,
          createdAt: values.createdAt,
        })
        .onConflictDoUpdate({
          target: projectTable.id,
          set: {
            name: values.name,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
