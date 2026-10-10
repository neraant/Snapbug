import { z } from "zod";

import { texts } from "@/client/modules/onboarding/consts/texts.const";

const inviteRowSchema = z.object({
  email: z.string(),
});

export const onboardingTeammateSchema = z
  .object({
    invites: z.array(inviteRowSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();
    let nonEmptyCount = 0;

    data.invites.forEach((invite, index) => {
      const trimmed = invite.email.trim();
      if (!trimmed) {
        return;
      }

      nonEmptyCount += 1;

      if (!z.email().safeParse(trimmed).success) {
        ctx.addIssue({
          code: "custom",
          message: texts.teammate.validation.invalidEmail,
          path: ["invites", index, "email"],
        });
      }

      const normalized = trimmed.toLowerCase();
      if (seen.has(normalized)) {
        ctx.addIssue({
          code: "custom",
          message: texts.teammate.validation.duplicateEmail,
          path: ["invites", index, "email"],
        });
      } else {
        seen.add(normalized);
      }
    });

    if (nonEmptyCount > 10) {
      ctx.addIssue({
        code: "custom",
        message: texts.teammate.validation.tooManyInvites,
        path: ["invites"],
      });
    }
  });

export type OnboardingTeammateSchemaType = z.infer<typeof onboardingTeammateSchema>;
