import { z } from "zod";

import { publicEnvSchema } from "@/shared/env.public.schema";

const envSchema = publicEnvSchema.extend({
  AUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SNAPBUG_API_KEY: process.env.NEXT_PUBLIC_SNAPBUG_API_KEY,

  // @disabled posthog
  // NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  // NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});
