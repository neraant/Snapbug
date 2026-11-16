import type { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type {
  FindInvitationByTokenInputDtoType,
  FindInvitationByTokenOutputDtoType,
  InvitationLookupStatusType,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

type SessionContext = {
  userId: string;
  userEmail: string;
};

export class FindInvitationByTokenUseCase {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly invitationRepository: InvitationRepository,
    private readonly organizationPort: OrganizationPort,
    private readonly userPort: UserPort,
    private readonly membershipPort: MembershipPort,
  ) {}

  async execute(
    input: FindInvitationByTokenInputDtoType,
    session?: SessionContext | null,
  ): Promise<FindInvitationByTokenOutputDtoType> {
    const invitation = await this.invitationRepository.findByToken(this.invitationService.hashToken(input.token));
    if (!invitation) {
      return { status: "invalid" };
    }

    const status = this.resolveStatus(invitation);
    if (status === "invalid" || status === "revoked" || status === "accepted") {
      return { status };
    }

    const organization = await this.organizationPort.findById(invitation.organizationId);
    if (!organization) {
      return { status: "invalid" };
    }

    const inviterName = await this.inviterDisplayName(invitation.invitedByUserId);

    if (status === "expired") {
      return {
        status: "expired",
        organizationName: organization.name,
        inviterName,
      };
    }

    const inviteeUser = await this.userPort.findByEmail(invitation.email);
    const accountExists = inviteeUser !== null;
    let alreadyMember = false;
    if (session && session.userEmail.toLowerCase() === invitation.email.toLowerCase()) {
      const membership = await this.membershipPort.findByUserAndOrganization({
        userId: session.userId,
        organizationId: invitation.organizationId,
      });
      alreadyMember = membership !== null;
    }

    return InvitationMapper.toFindByTokenOutput(invitation, {
      organizationName: organization.name,
      inviterName,
      role: UserRole.USER,
      accountExists,
      alreadyMember,
    });
  }

  private resolveStatus(invitation: Invitation): InvitationLookupStatusType {
    if (invitation.acceptedAt !== null) {
      return "accepted";
    }
    if (invitation.revokedAt !== null) {
      return "revoked";
    }
    if (!invitation.isPending()) {
      return "expired";
    }
    return "pending";
  }

  private async inviterDisplayName(userId: string): Promise<string> {
    try {
      const user = await this.userPort.findById(userId);
      const name = user.name?.trim();
      return name ? name : user.email;
    } catch {
      return "A teammate";
    }
  }
}
