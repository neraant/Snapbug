import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  findMembershipInputDtoSchema,
  findMembershipOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export const membershipContract = {
  findMembership: oc
    .input(findMembershipInputDtoSchema)
    .output(findMembershipOutputDtoSchema)
    .route({
      method: "GET",
      path: "/memberships",
      tags: ["membership"],
      summary: "Find membership",
      spec: sessionAuthSpec,
    }),
};
