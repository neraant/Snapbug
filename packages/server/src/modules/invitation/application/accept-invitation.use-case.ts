import type { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/invitation/port/project.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  AcceptInvitationInputDtoType,
  AcceptInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

/** Pending invites created before `project_ids` was stored use empty json and still mean all projects. */
const STORED_PROJECT_ACCESS_RELEASED_AT = new Date("2026-11-16T11:29:39.000Z");

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly withTransaction: WithTransactionType,
    private readonly invitationService: InvitationService,
    private readonly userPort: UserPort,
  ) {}

  async execute(
    input: AcceptInvitationInputDtoType,
    userId: string,
    userEmail: string,
  ): Promise<AcceptInvitationOutputDtoType> {
    const invitation = await this.invitationRepository.findByToken(this.invitationService.hashToken(input.token));
    if (!invitation?.isPending()) {
      throw new BadRequestError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }

    if (userEmail.toLowerCase() !== invitation.email) {
      throw new BadRequestError(ERROR_CODES.INVITATION_EMAIL_MISMATCH);
    }

    const existingMembership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: invitation.organizationId,
    });
    if (existingMembership) {
      if (invitation.isPending()) {
        await this.withTransaction(async (tx) => {
          await this.invitationService
            .withTx(tx)
            .withActor({ type: "user", id: userId })
            .saveWithAudit(invitation.accept(), "Accept invitation");
        });
      }
      return existingMembership;
    }

    const acceptedInvitation = invitation.accept();

    const membership = await this.withTransaction(async (tx) => {
      const membershipPort = this.membershipPort.withTx(tx);
      const projectPort = this.projectPort.withTx(tx);
      const invitationService = this.invitationService.withTx(tx).withActor({ type: "user", id: userId });
      const createdMembership = await membershipPort.createInvited(invitation.organizationId, userId, invitation.role);
      const projects = await projectPort.findManyByOrganizationId({ organizationId: invitation.organizationId });
      const organizationProjectIds = projects.map((project) => project.id);
      const projectIdsToGrant = this.resolveProjectIdsToGrant(invitation, organizationProjectIds);
      await membershipPort.grantProjects(createdMembership.id, projectIdsToGrant, userId);
      await invitationService.saveWithAudit(acceptedInvitation, "Accept invitation");
      return createdMembership;
    });

    await this.userPort.markOnboardingComplete(userId);

    return membership;
  }

  private resolveProjectIdsToGrant(invitation: Invitation, organizationProjectIds: string[]): string[] {
    if (invitation.projectIds.length > 0) {
      return invitation.projectIds;
    }

    if (
      invitation.role === UserRole.ADMIN ||
      invitation.createdAt.getTime() < STORED_PROJECT_ACCESS_RELEASED_AT.getTime()
    ) {
      return organizationProjectIds;
    }

    return [];
  }
}
