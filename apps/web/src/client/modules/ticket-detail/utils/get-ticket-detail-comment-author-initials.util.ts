import type { CommentModelType } from "@workspace/validation/modules/comment/dto/comment.model";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

export function getTicketDetailCommentAuthorInitials(
  comment: Pick<CommentModelType, "authorName" | "authorEmail">,
): string {
  const source = comment.authorName?.trim() || comment.authorEmail?.trim() || texts.comments.unknownAuthor;
  const [first] = source;
  return (first ?? "?").toUpperCase();
}
