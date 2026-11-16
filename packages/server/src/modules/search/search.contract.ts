import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import type { OrpcMetaType } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { searchInputDtoSchema, searchOutputDtoSchema } from "@workspace/validation/modules/search/dto/search.schema";

const search = oc.$meta<OrpcMetaType>({});

export const searchContract = {
  search: search
    .meta({ mcp: true, name: "search", readOnlyHint: true })
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