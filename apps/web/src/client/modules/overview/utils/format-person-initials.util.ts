export function formatPersonInitials(name: string | null, email: string | null): string {
  const trimmedName = name?.trim();
  if (trimmedName) return initialsFromLabel(trimmedName);

  const localPart = email?.split("@")[0]?.trim();
  if (localPart) return initialsFromLabel(localPart);

  return "?";
}

function initialsFromLabel(label: string): string {
  const parts = label.split(/[\s._-]+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (first && second) {
    return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
  }

  return label.slice(0, 2).toUpperCase();
}
