import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  addCommentInputDtoSchema,
  addCommentOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/add-comment.schema";
import {
  findCommentsInputDtoSchema,
  findCommentsOutputDtoSchema,
} from "@workspace/validation/modules/comment/dto/find-comments.schema";

const comment = oc.$meta<{ mcp?: boolean; mcpName?: string }>({});

export const commentContract = {
  addComment: comment
    .meta({ mcp: true, mcpName: "add_comment" })
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
    .input(findCommentsInputDtoSchema)
    .output(findCommentsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/comments",
      tags: ["comment"],
      summary: "List comments",
      spec: sessionAuthSpec,
    }),
};
