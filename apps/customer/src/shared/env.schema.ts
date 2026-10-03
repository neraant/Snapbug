import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),

  // @disabled posthog
  // NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().min(1),
  // NEXT_PUBLIC_POSTHOG_HOST: z.url(),
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  // @disabled posthog
  // NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  // NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});
