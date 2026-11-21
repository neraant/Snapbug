import { invitationTokenSchema } from "@workspace/validation/shared/invitation-token.schema";
import { userRoleSchema } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const findInvitationByTokenInputDtoSchema = z.object({
  token: invitationTokenSchema,
});

export type FindInvitationByTokenInputDtoType = z.infer<typeof findInvitationByTokenInputDtoSchema>;

export const invitationLookupStatusSchema = z.enum(["pending", "expired", "revoked", "accepted", "invalid"]);

export type InvitationLookupStatusType = z.infer<typeof invitationLookupStatusSchema>;

const invitationLookupInvalidSchema = z.object({
  status: z.literal("invalid"),
});

const invitationLookupRevokedSchema = z.object({
  status: z.literal("revoked"),
});

const invitationLookupAcceptedSchema = z.object({
  status: z.literal("accepted"),
});

const invitationLookupExpiredSchema = z.object({
  status: z.literal("expired"),
  organizationName: z.string(),
  inviterName: z.string(),
});

const invitationLookupPendingSchema = z.object({
  status: z.literal("pending"),
  email: z.email(),
  organizationId: z.uuid(),
  organizationName: z.string(),
  inviterName: z.string(),
  role: userRoleSchema,
  expiresAt: z.iso.datetime(),
  accountExists: z.boolean(),
  alreadyMember: z.boolean(),
});

export const findInvitationByTokenOutputDtoSchema = z.discriminatedUnion("status", [
  invitationLookupPendingSchema,
  invitationLookupExpiredSchema,
  invitationLookupRevokedSchema,
  invitationLookupAcceptedSchema,
  invitationLookupInvalidSchema,
]);

export type FindInvitationByTokenOutputDtoType = z.infer<typeof findInvitationByTokenOutputDtoSchema>;
