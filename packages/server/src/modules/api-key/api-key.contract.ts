import { oc } from "@orpc/contract";
import {
  findProjectByKeyInputDtoSchema,
  findProjectByKeyOutputDtoSchema,
} from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";

export const apiKeyContract = {
  findProjectByKey: oc
    .input(findProjectByKeyInputDtoSchema)
    .output(findProjectByKeyOutputDtoSchema)
    .route({ method: "GET", path: "/api-keys/project", tags: ["api-key"], summary: "Find project by key" }),
};
