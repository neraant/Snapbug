type InviteEmailChipContext = {
  memberEmails: Set<string>;
  pendingInvitationByEmail: Map<string, string>;
};

export type InviteEmailChipStatus = "member" | "pending";

export function normalizeInviteEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function inviteEmailChipStatus(
  email: string,
  context: InviteEmailChipContext,
): InviteEmailChipStatus | undefined {
  const normalized = normalizeInviteEmail(email);
  if (context.memberEmails.has(normalized)) {
    return "member";
  }
  if (context.pendingInvitationByEmail.has(normalized)) {
    return "pending";
  }
  return undefined;
}

export function buildInviteEmailChipContext(
  members: { email: string }[],
  invitations: { id: string; email: string }[],
): InviteEmailChipContext {
  return {
    memberEmails: new Set(members.map((member) => normalizeInviteEmail(member.email))),
    pendingInvitationByEmail: new Map(
      invitations.map((invitation) => [normalizeInviteEmail(invitation.email), invitation.id]),
    ),
  };
}
