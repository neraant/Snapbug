import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SNAPBUG_HOST: z.url().default("http://localhost:3000"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SNAPBUG_HOST: process.env.NEXT_PUBLIC_SNAPBUG_HOST || undefined,
});
