import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { createUserTokenOutputDtoSchema } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";
import {
  findUserByTokenInputDtoSchema,
  findUserByTokenOutputDtoSchema,
} from "@workspace/validation/modules/user-token/dto/find-user-by-token.schema";
import { findUserTokensOutputDtoSchema } from "@workspace/validation/modules/user-token/dto/find-user-tokens.schema";
import {
  revokeUserTokenInputDtoSchema,
  revokeUserTokenOutputDtoSchema,
} from "@workspace/validation/modules/user-token/dto/revoke-user-token.schema";

export const userTokenContract = {
  create: oc.output(createUserTokenOutputDtoSchema).route({
    method: "POST",
    path: "/user-tokens",
    tags: ["user-token"],
    summary: "Create a personal MCP token",
    spec: sessionAuthSpec,
  }),
  findMany: oc.output(findUserTokensOutputDtoSchema).route({
    method: "GET",
    path: "/user-tokens",
    tags: ["user-token"],
    summary: "List personal MCP tokens",
    spec: sessionAuthSpec,
  }),
  revoke: oc
    .input(revokeUserTokenInputDtoSchema)
    .output(revokeUserTokenOutputDtoSchema)
    .route({
      method: "POST",
      path: "/user-tokens/revoke",
      tags: ["user-token"],
      summary: "Revoke a personal MCP token",
      spec: sessionAuthSpec,
    }),
  findUserByToken: oc
    .input(findUserByTokenInputDtoSchema)
    .output(findUserByTokenOutputDtoSchema)
    .route({
      method: "POST",
      path: "/user-tokens/user",
      tags: ["user-token"],
      summary: "Find the member for a personal MCP token",
    }),
};
