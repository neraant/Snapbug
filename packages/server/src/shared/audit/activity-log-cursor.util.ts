export function encodeActivityLogCursor(occurredAt: Date, id: string): string {
  return `${occurredAt.toISOString()}|${id}`;
}

export function decodeActivityLogCursor(cursor: string): { occurredAt: Date; id: string } | null {
  const separator = cursor.lastIndexOf("|");
  if (separator <= 0) return null;

  const occurredAtIso = cursor.slice(0, separator);
  const id = cursor.slice(separator + 1);
  const occurredAt = new Date(occurredAtIso);
  if (Number.isNaN(occurredAt.getTime()) || id.length === 0) return null;

  return { occurredAt, id };
}
