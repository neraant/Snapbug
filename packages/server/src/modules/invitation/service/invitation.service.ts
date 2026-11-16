import type { DbClient } from "@workspace/database";
import type { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import { env } from "@workspace/server/shared/env/env.schema";
import { createHash, createHmac } from "crypto";

const INVITATION_ENTITY_TYPE = "invitation";

export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): InvitationService {
    return new InvitationService(this.invitationRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): InvitationService {
    return new InvitationService(this.invitationRepository, this.auditLogService, actor);
  }

  buildInvitationToken(invitationId: string, tokenVersion: number): string {
    return createHmac("sha256", env.AUTH_SECRET).update(`${invitationId}:${tokenVersion}`).digest("hex");
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  inviteUrl(token: string): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return `${appUrl}/invite/${token}`;
  }

  async saveWithAudit(invitation: Invitation, action: string): Promise<void> {
    const previous = await this.invitationRepository.findById(invitation.id);
    await this.invitationRepository.save(invitation);

    await this.auditLogService.save({
      action,
      entityType: INVITATION_ENTITY_TYPE,
      entityId: invitation.id,
      organizationId: invitation.organizationId,
      projectId: null,
      actor: this.actor,
      oldSnapshot: previous ? InvitationMapper.toAudit(previous) : null,
      newSnapshot: InvitationMapper.toAudit(invitation),
    });
  }
}