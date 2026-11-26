import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  EMAIL_TRANSPORT: z.enum(["resend", "log"]).default("resend"),
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .optional()
    .transform((value) => {
      const token = value?.trim();
      return token ? token : undefined;
    }),
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TRANSPORT: process.env.EMAIL_TRANSPORT,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
});
