import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  createMembershipInputDtoSchema,
  createMembershipOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import { findMembershipByUserOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import {
  findMembershipInputDtoSchema,
  findMembershipOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export const membershipContract = {
  createMembership: oc
    .input(createMembershipInputDtoSchema)
    .output(createMembershipOutputDtoSchema)
    .route({
      method: "POST",
      path: "/memberships",
      tags: ["membership"],
      summary: "Create membership",
      spec: sessionAuthSpec,
    }),
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
  findMembershipByUser: oc.output(findMembershipByUserOutputDtoSchema).route({
    method: "GET",
    path: "/memberships/by-user",
    tags: ["membership"],
    summary: "Find membership for the current user",
    spec: sessionAuthSpec,
  }),
};
