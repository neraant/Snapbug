import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { InvitationPersistedType } from "@workspace/server/modules/invitation/entity/invitation.types";
import type { FindInvitationByTokenOutputDtoType } from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";

export abstract class InvitationMapper {
  static fromPersistence(row: InvitationPersistedType): Invitation {
    return new Invitation(row);
  }

  static toPersistence(invitation: Invitation): InvitationPersistedType {
    return invitation.toObject();
  }

  static toFindByTokenOutput(invitation: Invitation, organizationName: string): FindInvitationByTokenOutputDtoType {
    return { email: invitation.email, organizationName };
  }
}
