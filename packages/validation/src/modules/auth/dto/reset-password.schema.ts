import { z } from "zod";

export const resetPasswordInputDtoSchema = z.object({
  token: z.uuid(),
  password: z.string().min(8),
});

export type ResetPasswordInputDtoType = z.infer<typeof resetPasswordInputDtoSchema>;

export const resetPasswordOutputDtoSchema = z.object({
  email: z.email(),
});

export type ResetPasswordOutputDtoType = z.infer<typeof resetPasswordOutputDtoSchema>;
