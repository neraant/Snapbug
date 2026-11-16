import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { InvitationPersistedType } from "@workspace/server/modules/invitation/entity/invitation.types";
import type { FindInvitationByTokenOutputDtoType } from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import type { InvitationModelType } from "@workspace/validation/modules/invitation/dto/invitation.model";
export abstract class InvitationMapper {
  static fromPersistence(row: InvitationPersistedType): Invitation {
    return new Invitation(row);
  }

  static toPersistence(invitation: Invitation): InvitationPersistedType {
    return invitation.toObject();
  }

  static toDto(invitation: Invitation): InvitationModelType {
    const { id, email, expiresAt, createdAt, revokedAt } = invitation.toObject();
    return {
      id,
      email,
      expiresAt: expiresAt.toISOString(),
      createdAt: createdAt.toISOString(),
      revokedAt: revokedAt?.toISOString() ?? null,
    };
  }

  static toAudit(invitation: Invitation): Record<string, unknown> {
    const { email, invitedByUserId, role, projectIds, expiresAt, acceptedAt, revokedAt, tokenVersion } =
      invitation.toObject();
    return { email, invitedByUserId, role, projectIds, expiresAt, acceptedAt, revokedAt, tokenVersion };
  }

  static toFindByTokenOutput(
    invitation: Invitation,
    context: {
      organizationName: string;
      inviterName: string;
      accountExists: boolean;
      alreadyMember: boolean;
    },
  ): Extract<FindInvitationByTokenOutputDtoType, { status: "pending" }> {
    const { email, organizationId, expiresAt, role } = invitation.toObject();
    return {
      status: "pending",
      email,
      organizationId,
      organizationName: context.organizationName,
      inviterName: context.inviterName,
      role,
      expiresAt: expiresAt.toISOString(),
      accountExists: context.accountExists,
      alreadyMember: context.alreadyMember,
    };
  }
}
