import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { organizationTable } from "@workspace/database/schema";
import type { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class OrganizationRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findById(id: string): Promise<Organization | null> {
    const [row] = await this.db.select().from(organizationTable).where(eq(organizationTable.id, id));
    return row ? OrganizationMapper.fromPersistence(row) : null;
  }

  async save(organization: Organization): Promise<void> {
    const values = OrganizationMapper.toPersistence(organization);

    try {
      await this.db
        .insert(organizationTable)
        .values({
          id: values.id,
          name: values.name,
          reports_retention_days: values.reports_retention_days,
          createdAt: values.createdAt,
        })
        .onConflictDoUpdate({
          target: organizationTable.id,
          set: {
            name: values.name,
            reports_retention_days: values.reports_retention_days,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
