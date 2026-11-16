const separator = "|";

export function encodeTicketListCursor(boardOrder: number, id: string): string {
  return `${boardOrder}${separator}${id}`;
}

export function decodeTicketListCursor(cursor: string): { boardOrder: number; id: string } | null {
  const index = cursor.lastIndexOf(separator);
  if (index <= 0) return null;
  const boardOrder = Number(cursor.slice(0, index));
  const id = cursor.slice(index + 1);
  if (!Number.isFinite(boardOrder) || id.length === 0) return null;
  return { boardOrder, id };
}