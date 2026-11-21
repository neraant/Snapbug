import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const changePasswordInputDtoSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInputDtoType = z.infer<typeof changePasswordInputDtoSchema>;

export const changePasswordOutputDtoSchema = userModelSchema;

export type ChangePasswordOutputDtoType = z.infer<typeof changePasswordOutputDtoSchema>;
