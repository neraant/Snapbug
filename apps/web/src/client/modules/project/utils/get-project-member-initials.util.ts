export function getProjectMemberInitials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const words = source.split(/[\s@._-]+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
