import type { DbClient } from "@workspace/database";
import type { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const MEMBERSHIP_ENTITY_TYPE = "membership";

export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): MembershipService {
    return new MembershipService(this.membershipRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): MembershipService {
    return new MembershipService(this.membershipRepository, this.auditLogService, actor);
  }

  async saveWithAudit(membership: Membership, action: string): Promise<void> {
    const previous = await this.membershipRepository.findById(membership.id);
    await this.membershipRepository.save(membership);

    await this.auditLogService.save({
      action,
      entityType: MEMBERSHIP_ENTITY_TYPE,
      entityId: membership.id,
      organizationId: membership.organizationId,
      projectId: null,
      actor: this.actor,
      oldSnapshot: previous ? MembershipMapper.toAudit(previous) : null,
      newSnapshot: MembershipMapper.toAudit(membership),
    });
  }

  async deleteWithAudit(membership: Membership, action: string): Promise<void> {
    await this.membershipRepository.delete(membership);

    await this.auditLogService.save({
      action,
      entityType: MEMBERSHIP_ENTITY_TYPE,
      entityId: membership.id,
      organizationId: membership.organizationId,
      projectId: null,
      actor: this.actor,
      oldSnapshot: MembershipMapper.toAudit(membership),
      newSnapshot: { userId: null, role: null },
    });
  }
}
