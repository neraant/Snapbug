import { z } from "zod";

export const verifyCredentialsInputDtoSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type VerifyCredentialsInputDtoType = z.infer<typeof verifyCredentialsInputDtoSchema>;
