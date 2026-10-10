import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { InvitationPersistedType } from "@workspace/server/modules/invitation/entity/invitation.types";

export abstract class InvitationMapper {
  static fromPersistence(row: InvitationPersistedType): Invitation {
    return new Invitation(row);
  }

  static toPersistence(invitation: Invitation): InvitationPersistedType {
    return invitation.toObject();
  }
}
