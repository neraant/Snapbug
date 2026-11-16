const separator = "|";

export function encodeTicketListCursor(boardOrder: number, createdAt: Date, id: string): string {
  return `${boardOrder}${separator}${createdAt.getTime()}${separator}${id}`;
}

export function decodeTicketListCursor(cursor: string): { boardOrder: number; createdAtMs: number; id: string } | null {
  const parts = cursor.split(separator);
  if (parts.length !== 3) return null;
  const boardOrder = Number(parts[0]);
  const createdAtMs = Number(parts[1]);
  const id = parts[2] ?? "";
  if (!Number.isFinite(boardOrder) || !Number.isFinite(createdAtMs) || id.length === 0) return null;
  return { boardOrder, createdAtMs, id };
}
