import { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { MembershipAdapter } from "@workspace/server/modules/invitation/adapter/membership.adapter";
import { OrganizationAdapter } from "@workspace/server/modules/invitation/adapter/organization.adapter";
import { UserAdapter } from "@workspace/server/modules/invitation/adapter/user.adapter";
import { AcceptInvitationUseCase } from "@workspace/server/modules/invitation/application/accept-invitation.use-case";
import { FindInvitationByTokenUseCase } from "@workspace/server/modules/invitation/application/find-invitation-by-token.use-case";
import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { withTransaction } from "@workspace/server/shared/database/transaction.util";
import { resendClient } from "@workspace/server/shared/email/email.client";
import { EmailService } from "@workspace/server/shared/email/service/email.service";
import type {
  AcceptInvitationInputDtoType,
  AcceptInvitationOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import type {
  FindInvitationByTokenInputDtoType,
  FindInvitationByTokenOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import type {
  SendInvitationsInputDtoType,
  SendInvitationsOutputDtoType,
} from "@workspace/validation/modules/invitation/dto/send-invitation.schema";

export async function sendInvitations(
  input: SendInvitationsInputDtoType,
  userId: string,
  inviterEmail: string,
): Promise<SendInvitationsOutputDtoType> {
  const useCase = new SendInvitationsUseCase(
    new InvitationRepository(),
    new MembershipAdapter(),
    new UserAdapter(),
    new AuthService(),
    new EmailService(resendClient),
  );
  return await useCase.execute(input, userId, inviterEmail);
}

export async function findInvitationByToken(
  input: FindInvitationByTokenInputDtoType,
): Promise<FindInvitationByTokenOutputDtoType> {
  const useCase = new FindInvitationByTokenUseCase(new InvitationRepository(), new OrganizationAdapter());
  return await useCase.execute(input);
}

export async function acceptInvitation(
  input: AcceptInvitationInputDtoType,
  userId: string,
  userEmail: string,
): Promise<AcceptInvitationOutputDtoType> {
  const useCase = new AcceptInvitationUseCase(
    new InvitationRepository(),
    new MembershipAdapter(),
    new MembershipRepository(),
    withTransaction,
  );
  return await useCase.execute(input, userId, userEmail);
}
