import { z } from "zod";

export const requestResetPasswordInputDtoSchema = z.object({
  email: z.email(),
});

export type RequestResetPasswordInputDtoType = z.infer<typeof requestResetPasswordInputDtoSchema>;

export const requestResetPasswordOutputDtoSchema = z.void();

export type RequestResetPasswordOutputDtoType = z.infer<typeof requestResetPasswordOutputDtoSchema>;
