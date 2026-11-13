import { z } from "zod";

export const COMMENT_BODY_MAX_LENGTH = 4000;

export const commentBodySchema = z.string().trim().min(1).max(COMMENT_BODY_MAX_LENGTH);

export const commentModelSchema = z.object({
  id: z.uuid(),
  bugReportId: z.uuid(),
  authorUserId: z.uuid(),
  authorName: z.string().nullable(),
  authorEmail: z.email().nullable(),
  body: z.string(),
  createdAt: z.iso.datetime(),
});

export type CommentModelType = z.infer<typeof commentModelSchema>;
