export function authPathWithInvitation(path: string, invitationToken?: string): string {
  if (!invitationToken) {
    return path;
  }

  return `${path}?invitation=${invitationToken}`;
}
