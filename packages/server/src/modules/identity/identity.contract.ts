import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  createUserOutputDtoSchema,
  createUserWithPasswordHashInputDtoSchema,
} from "@workspace/validation/modules/user/dto/create-user.schema";
import {
  findUserByEmailInputDtoSchema,
  findUserByEmailOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/find-user-by-email.schema";
import {
  updateInterfaceLanguageInputDtoSchema,
  updateInterfaceLanguageOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/update-interface-language.schema";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";

export const identityContract = {
  createUser: oc
    .input(createUserWithPasswordHashInputDtoSchema)
    .output(createUserOutputDtoSchema)
    .route({ method: "POST", path: "/users", tags: ["identity"], summary: "Create user", spec: sessionAuthSpec }),
  findUserByEmail: oc
    .input(findUserByEmailInputDtoSchema)
    .output(findUserByEmailOutputDtoSchema)
    .route({
      method: "GET",
      path: "/users/by-email",
      tags: ["identity"],
      summary: "Find user by email",
      spec: sessionAuthSpec,
    }),
  updateInterfaceLanguage: oc
    .input(updateInterfaceLanguageInputDtoSchema)
    .output(updateInterfaceLanguageOutputDtoSchema)
    .route({
      method: "POST",
      path: "/users/interface-language",
      tags: ["identity"],
      summary: "Update interface language",
      spec: sessionAuthSpec,
    }),
  findCurrentUser: oc.output(userModelSchema).route({
    method: "GET",
    path: "/users/me",
    tags: ["identity"],
    summary: "Find current user",
    spec: sessionAuthSpec,
  }),
};
