import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/invitation/port/project.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError, ConflictError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  AcceptInvitationInputDtoType,
  AcceptInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly withTransaction: WithTransactionType,
    private readonly invitationService: InvitationService,
  ) {}

  async execute(
    input: AcceptInvitationInputDtoType,
    userId: string,
    userEmail: string,
  ): Promise<AcceptInvitationOutputDtoType> {
    const invitation = await this.invitationRepository.findByToken(input.token);
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
      throw new ConflictError(ERROR_CODES.MEMBERSHIP_ALREADY_EXISTS);
    }

    const acceptedInvitation = invitation.accept();

    const membership = await this.withTransaction(async (tx) => {
      const membershipPort = this.membershipPort.withTx(tx);
      const projectPort = this.projectPort.withTx(tx);
      const invitationService = this.invitationService.withTx(tx).withActor({ type: "user", id: userId });
      const createdMembership = await membershipPort.createInvited(invitation.organizationId, userId);
      const projects = await projectPort.findManyByOrganizationId({ organizationId: invitation.organizationId });
      await membershipPort.grantProjects(
        createdMembership.id,
        projects.map((project) => project.id),
        userId,
      );
      await invitationService.saveWithAudit(acceptedInvitation, "Accept invitation");
      return createdMembership;
    });

    return membership;
  }
}
