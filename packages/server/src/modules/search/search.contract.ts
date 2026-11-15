import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { searchInputDtoSchema, searchOutputDtoSchema } from "@workspace/validation/modules/search/dto/search.schema";

export const searchContract = {
  search: oc
    .input(searchInputDtoSchema)
    .output(searchOutputDtoSchema)
    .route({
      method: "GET",
      path: "/search",
      tags: ["search"],
      summary: "Search tickets and projects in the current organization",
      spec: sessionAuthSpec,
    }),
};