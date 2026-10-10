import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindInvitationByTokenInputDtoType,
  FindInvitationByTokenOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";

export class FindInvitationByTokenUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly organizationPort: OrganizationPort,
  ) {}

  async execute(input: FindInvitationByTokenInputDtoType): Promise<FindInvitationByTokenOutputDtoType> {
    const invitation = await this.invitationRepository.findByToken(input.token);
    if (!invitation?.isPending()) {
      throw new NotFoundError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }

    const organizationName = await this.organizationPort.findNameById(invitation.organizationId);
    if (!organizationName) {
      throw new NotFoundError(ERROR_CODES.INVALID_INVITATION_TOKEN);
    }

    return {
      email: invitation.email,
      organizationName,
    };
  }
}
