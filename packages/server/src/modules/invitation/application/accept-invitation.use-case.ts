import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { MembershipFactory } from "@workspace/server/modules/membership/entity/membership.factory";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError, ConflictError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  AcceptInvitationInputDtoType,
  AcceptInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly membershipRepository: MembershipRepository,
    private readonly withTransaction: WithTransactionType,
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

    const existingMembership = await this.membershipPort.findByUser(userId);
    if (existingMembership) {
      throw new ConflictError(ERROR_CODES.USER_ALREADY_HAS_ORGANIZATION);
    }

    const membership = MembershipFactory.create({
      userId,
      organizationId: invitation.organizationId,
      role: UserRole.USER,
    });
    const acceptedInvitation = invitation.accept();

    await this.withTransaction(async (tx) => {
      const membershipRepository = this.membershipRepository.withTx(tx);
      const invitationRepository = this.invitationRepository.withTx(tx);
      await membershipRepository.save(membership);
      await invitationRepository.save(acceptedInvitation);
    });

    return MembershipMapper.toDto(membership);
  }
}
