export function encodeNotificationCursor(createdAt: Date, id: string): string {
  return `${createdAt.toISOString()}|${id}`;
}

export function decodeNotificationCursor(cursor: string): { createdAt: Date; id: string } | null {
  const separator = cursor.lastIndexOf("|");
  if (separator <= 0) return null;

  const createdAtIso = cursor.slice(0, separator);
  const id = cursor.slice(separator + 1);
  const createdAt = new Date(createdAtIso);
  if (Number.isNaN(createdAt.getTime()) || id.length === 0) return null;

  return { createdAt, id };
}