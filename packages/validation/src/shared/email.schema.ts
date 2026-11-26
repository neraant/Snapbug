import z from "zod";

/** RFC 5321 maximum length of an email address. */
export const EMAIL_MAX_LENGTH = 254;

export const emailSchema = z.string().trim().min(1).max(EMAIL_MAX_LENGTH).pipe(z.email());

type EmailFieldMessages = {
  required: string;
  invalid: string;
  tooLong: string;
};

/** Client form field: empty, over-long, and malformed values get distinct messages. */
export function emailFieldSchema(messages: EmailFieldMessages) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value.length === 0) {
        ctx.addIssue({ code: "custom", message: messages.required });
        return;
      }

      if (value.length > EMAIL_MAX_LENGTH) {
        ctx.addIssue({ code: "custom", message: messages.tooLong });
        return;
      }

      if (!z.email().safeParse(value).success) {
        ctx.addIssue({ code: "custom", message: messages.invalid });
      }
    });
}
