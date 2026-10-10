import { z } from "zod";

export function parseInvitationToken(raw: string | null): string | undefined {
  if (raw == null) {
    return undefined;
  }

  return z.uuid().safeParse(raw).success ? raw : undefined;
}
