const FALLBACK_ORGANIZATION_NAME = "Workspace";

export function defaultOrganizationName(user: { name?: string | null; email?: string | null } | undefined): string {
  const name = user?.name?.trim();
  if (name) return name;

  const localPart = user?.email?.split("@")[0]?.trim();
  if (localPart) return localPart;

  return FALLBACK_ORGANIZATION_NAME;
}
