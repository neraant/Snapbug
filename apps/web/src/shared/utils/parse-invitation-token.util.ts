import { z } from "zod";

export function parseInvitationToken(raw: string | null | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }

  return z.uuid().safeParse(raw).success ? raw : undefined;
}

export function readInvitationSearchParam(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return parseInvitationToken(raw);
}
