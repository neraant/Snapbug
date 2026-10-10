import { z } from "zod";

export const findInvitationByTokenInputDtoSchema = z.object({
  token: z.uuid(),
});

export type FindInvitationByTokenInputDtoType = z.infer<typeof findInvitationByTokenInputDtoSchema>;

export const findInvitationByTokenOutputDtoSchema = z.object({
  email: z.email(),
  organizationName: z.string(),
});

export type FindInvitationByTokenOutputDtoType = z.infer<typeof findInvitationByTokenOutputDtoSchema>;
