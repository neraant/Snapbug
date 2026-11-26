import { emailSchema } from "@workspace/validation/shared/email.schema";
import { invitationTokenSchema } from "@workspace/validation/shared/invitation-token.schema";
import { z } from "zod";

export const requestResetPasswordInputDtoSchema = z.object({
  email: emailSchema,
  invitation: invitationTokenSchema.optional(),
});

export type RequestResetPasswordInputDtoType = z.infer<typeof requestResetPasswordInputDtoSchema>;

export const requestResetPasswordOutputDtoSchema = z.void();

export type RequestResetPasswordOutputDtoType = z.infer<typeof requestResetPasswordOutputDtoSchema>;
