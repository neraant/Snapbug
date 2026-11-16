import { z } from "zod";

export const CommentAuthorSource = {
  WEB: "web",
  MCP: "mcp",
} as const;

export const commentAuthorSourceSchema = z.enum([CommentAuthorSource.WEB, CommentAuthorSource.MCP]);

export type CommentAuthorSourceType = z.infer<typeof commentAuthorSourceSchema>;