import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  findProjectApiKeyInputDtoSchema,
  findProjectApiKeyOutputDtoSchema,
} from "@workspace/validation/modules/api-key/dto/find-project-api-key.schema";
import {
  findProjectByKeyInputDtoSchema,
  findProjectByKeyOutputDtoSchema,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export const apiKeyContract = {
  findProjectByKey: oc
    .input(findProjectByKeyInputDtoSchema)
    .output(findProjectByKeyOutputDtoSchema)
    .route({ method: "GET", path: "/api-keys/project", tags: ["api-key"], summary: "Find project by key" }),
  findProjectApiKey: oc
    .input(findProjectApiKeyInputDtoSchema)
    .output(findProjectApiKeyOutputDtoSchema)
    .route({
      method: "GET",
      path: "/api-keys/project-key",
      tags: ["api-key"],
      summary: "Find project API key",
      spec: sessionAuthSpec,
    }),
};
