import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import type { OrpcMetaType } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import {
  addCommentInputDtoSchema,
  addCommentOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/add-comment.schema";
import {
  deleteCommentInputDtoSchema,
  deleteCommentOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/delete-comment.schema";
import {
  findCommentsInputDtoSchema,
  findCommentsOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/find-comments.schema";
import {
  updateCommentInputDtoSchema,
  updateCommentOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/update-comment.schema";

const comment = oc.$meta<OrpcMetaType>({});

export const commentContract = {
  addComment: comment
    .meta({ mcp: true, name: "add_comment", readOnlyHint: false, destructiveHint: false })
    .input(addCommentInputDtoSchema)
    .output(addCommentOutputDtoSchema)
    .route({
      method: "POST",
      path: "/comments",
      tags: ["comment"],
      summary: "Add comment",
      spec: sessionAuthSpec,
    }),
  findComments: comment
    .meta({ mcp: true, name: "list_comments", readOnlyHint: true })
    .input(findCommentsInputDtoSchema)
    .output(findCommentsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/comments",
      tags: ["comment"],
      summary: "List comments",
      spec: sessionAuthSpec,
    }),
  updateComment: comment
    .input(updateCommentInputDtoSchema)
    .output(updateCommentOutputDtoSchema)
    .route({
      method: "PATCH",
      path: "/comments",
      tags: ["comment"],
      summary: "Update comment",
      spec: sessionAuthSpec,
    }),
  deleteComment: comment
    .input(deleteCommentInputDtoSchema)
    .output(deleteCommentOutputDtoSchema)
    .route({
      method: "DELETE",
      path: "/comments",
      tags: ["comment"],
      summary: "Delete comment",
      spec: sessionAuthSpec,
    }),
};
