import { invitationTokenSchema } from "@workspace/validation/shared/invitation-token.schema";
import { z } from "zod";

export const requestResetPasswordInputDtoSchema = z.object({
  email: z.email(),
  invitation: invitationTokenSchema.optional(),
});

export type RequestResetPasswordInputDtoType = z.infer<typeof requestResetPasswordInputDtoSchema>;

export const requestResetPasswordOutputDtoSchema = z.void();

export type RequestResetPasswordOutputDtoType = z.infer<typeof requestResetPasswordOutputDtoSchema>;
