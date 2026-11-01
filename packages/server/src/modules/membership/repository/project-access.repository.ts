import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { projectAccessTable } from "@workspace/database/schema";
import type { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import { ProjectAccessMapper } from "@workspace/server/modules/membership/entity/project-access.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class ProjectAccessRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): ProjectAccessRepository {
    return new ProjectAccessRepository(tx);
  }

  async findById(id: string): Promise<ProjectAccess | null> {
    const row = await this.db.query.projectAccessTable.findFirst({
      where: { id },
    });
    return row ? ProjectAccessMapper.fromPersistence(row) : null;
  }

  async findManyByMembershipId(membershipId: string): Promise<ProjectAccess[]> {
    const rows = await this.db.query.projectAccessTable.findMany({
      where: { membershipId },
    });
    return rows.map((row) => ProjectAccessMapper.fromPersistence(row));
  }

  async findManyByProjectId(projectId: string): Promise<ProjectAccess[]> {
    const rows = await this.db.query.projectAccessTable.findMany({
      where: { projectId },
    });
    return rows.map((row) => ProjectAccessMapper.fromPersistence(row));
  }

  async save(projectAccess: ProjectAccess): Promise<void> {
    const values = ProjectAccessMapper.toPersistence(projectAccess);

    try {
      await this.db
        .insert(projectAccessTable)
        .values(values)
        .onConflictDoUpdate({
          target: projectAccessTable.id,
          set: {
            membershipId: values.membershipId,
            projectId: values.projectId,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async delete(projectAccess: ProjectAccess): Promise<void> {
    try {
      await this.db.delete(projectAccessTable).where(eq(projectAccessTable.id, projectAccess.id));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
