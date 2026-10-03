import { oc } from "@orpc/contract";
import {
  createUserOutputDtoSchema,
  createUserWithPasswordHashInputDtoSchema,
} from "@workspace/validation/modules/user/dto/create-user.schema";
import {
  findUserByEmailInputDtoSchema,
  findUserByEmailOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/find-user-by-email.schema";
import {
  findUserCredentialsByEmailInputDtoSchema,
  findUserCredentialsByEmailOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/find-user-credentials-by-email.schema";

export const identityContract = {
  createUser: oc
    .input(createUserWithPasswordHashInputDtoSchema)
    .output(createUserOutputDtoSchema)
    .route({ method: "POST", path: "/users", tags: ["identity"], summary: "Create user" }),
  findUserByEmail: oc
    .input(findUserByEmailInputDtoSchema)
    .output(findUserByEmailOutputDtoSchema)
    .route({ method: "GET", path: "/users/by-email", tags: ["identity"], summary: "Find user by email" }),
  findUserCredentialsByEmail: oc
    .input(findUserCredentialsByEmailInputDtoSchema)
    .output(findUserCredentialsByEmailOutputDtoSchema)
    .route({
      method: "GET",
      path: "/users/credentials",
      tags: ["identity"],
      summary: "Find user credentials by email",
    }),
};
