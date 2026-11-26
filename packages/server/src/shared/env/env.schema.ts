import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

const optionalFlag = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim().toLowerCase();
    return trimmed ? trimmed : undefined;
  });

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  EMAIL_TRANSPORT: z.enum(["resend", "log"]).default("resend"),
  SNAPBUG_E2E: optionalFlag,
  ACCESS_KEY_ID: optionalString,
  SECRET_ACCESS_KEY: optionalString,
  ACCOUNT_ID: optionalString,
  BUCKET_NAME: optionalString,
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TRANSPORT: process.env.EMAIL_TRANSPORT,
  SNAPBUG_E2E: process.env.SNAPBUG_E2E,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  ACCOUNT_ID: process.env.ACCOUNT_ID,
  BUCKET_NAME: process.env.BUCKET_NAME,
});
