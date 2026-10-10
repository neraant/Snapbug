import type { OnboardingTeammateSchemaType } from "@/client/modules/onboarding/schemas/onboarding-teammate.schema";

export function collectTeammateEmails(invites: OnboardingTeammateSchemaType["invites"]): string[] {
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const { email } of invites) {
    const trimmed = email.trim();
    if (!trimmed) {
      continue;
    }

    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    emails.push(trimmed);
  }

  return emails;
}
