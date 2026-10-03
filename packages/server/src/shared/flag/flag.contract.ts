// @disabled flag
import { oc } from "@orpc/contract";
import { flagModelSchema } from "@workspace/validation/modules/flag/dto/flag.model";

export const flagContract = {
  findMany: oc
    .output(flagModelSchema)
    .route({ method: "GET", path: "/flag", tags: ["flag"], summary: "Get feature flags" }),
};
