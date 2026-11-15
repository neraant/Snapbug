import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { projectTable } from "@workspace/database/schema";
import type { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { ProjectPersistedType } from "@workspace/server/modules/project/entity/project.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

function mapRow(project: typeof projectTable.$inferSelect): ProjectPersistedType {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    color: project.color,
    organizationId: project.organizationId,
    defaultAssigneeId: project.defaultAssigneeId ?? null,
    storeVisitorIp: project.storeVisitorIp,
    collectVisitorEmail: project.collectVisitorEmail,
    archivedAt: project.archivedAt ?? null,
    widgetSettings: project.widgetSettings ?? null,
    createdAt: project.createdAt,
  };
}

export class ProjectRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): ProjectRepository {
    return new ProjectRepository(tx);
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.db.query.projectTable.findFirst({
      where: { id },
    });
    return project ? ProjectMapper.fromPersistence(mapRow(project)) : null;
  }

  async findManyByIds(ids: string[]): Promise<Project[]> {
    if (ids.length === 0) return [];

    const projects = await this.db.query.projectTable.findMany({
      where: { id: { in: ids } },
    });

    return projects.map((project) => ProjectMapper.fromPersistence(mapRow(project)));
  }

  async findBySlugAndOrganizationId(slug: string, organizationId: string): Promise<Project | null> {
    const project = await this.db.query.projectTable.findFirst({
      where: { slug, organizationId },
    });
    return project ? ProjectMapper.fromPersistence(mapRow(project)) : null;
  }

  async findSlugsByOrganizationId(organizationId: string): Promise<string[]> {
    const rows = await this.db.query.projectTable.findMany({
      columns: { slug: true },
      where: { organizationId },
    });
    return rows.map((row) => row.slug);
  }

  async findManyByOrganizationId(organizationId: string): Promise<Project[]> {
    const projects = await this.db.query.projectTable.findMany({
      where: { organizationId },
    });
    return projects.map((project) => ProjectMapper.fromPersistence(mapRow(project)));
  }

  async save(project: Project): Promise<void> {
    const values = ProjectMapper.toPersistence(project);

    try {
      await this.db
        .insert(projectTable)
        .values({
          id: values.id,
          name: values.name,
          slug: values.slug,
          color: values.color,
          organizationId: values.organizationId,
          defaultAssigneeId: values.defaultAssigneeId,
          storeVisitorIp: values.storeVisitorIp,
          collectVisitorEmail: values.collectVisitorEmail,
          archivedAt: values.archivedAt,
          widgetSettings: values.widgetSettings,
          createdAt: values.createdAt,
        })
        .onConflictDoUpdate({
          target: projectTable.id,
          set: {
            name: values.name,
            slug: values.slug,
            color: values.color,
            defaultAssigneeId: values.defaultAssigneeId,
            storeVisitorIp: values.storeVisitorIp,
            collectVisitorEmail: values.collectVisitorEmail,
            archivedAt: values.archivedAt,
            widgetSettings: values.widgetSettings,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.delete(projectTable).where(eq(projectTable.id, id));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async isSlugTakenInOrganization(slug: string, organizationId: string, excludeProjectId?: string): Promise<boolean> {
    const project = await this.db.query.projectTable.findFirst({
      columns: { id: true },
      where: { slug, organizationId },
    });
    if (!project) return false;
    if (excludeProjectId && project.id === excludeProjectId) return false;
    return true;
  }
}
