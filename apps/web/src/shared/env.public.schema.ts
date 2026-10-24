import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SNAPBUG_API_KEY: z
    .string()
    .optional()
    .transform((value) => {
      const apiKey = value?.trim();
      return apiKey ? apiKey : undefined;
    }),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SNAPBUG_API_KEY: process.env.NEXT_PUBLIC_SNAPBUG_API_KEY,
});
