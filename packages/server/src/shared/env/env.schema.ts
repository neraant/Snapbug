import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .optional()
    .transform((value) => {
      const token = value?.trim();
      return token ? token : undefined;
    }),
});

export const env = envSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
});
