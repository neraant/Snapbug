import { z } from "zod";

export const updateUserInputDtoSchema = z
  .object({
    userId: z.uuid(),
    name: z.string().min(1).nullable().optional(),
    email: z.email().optional(),
    passwordHash: z.string().min(1).optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined || data.passwordHash !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateUserInputDtoType = z.infer<typeof updateUserInputDtoSchema>;
