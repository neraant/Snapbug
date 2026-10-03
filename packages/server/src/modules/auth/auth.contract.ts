import { oc } from "@orpc/contract";
import {
  verifyCredentialsInputDtoSchema,
  verifyCredentialsOutputDtoSchema,
} from "@workspace/validation/modules/auth/dto/verify-credentials.schema";
import {
  createUserInputDtoSchema,
  createUserOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/create-user.schema";

export const authContract = {
  signUp: oc
    .input(createUserInputDtoSchema)
    .output(createUserOutputDtoSchema)
    .route({ method: "POST", path: "/auth/sign-up", tags: ["auth"], summary: "Sign up" }),
  verifyCredentials: oc
    .input(verifyCredentialsInputDtoSchema)
    .output(verifyCredentialsOutputDtoSchema)
    .route({ method: "POST", path: "/auth/verify-credentials", tags: ["auth"], summary: "Verify credentials" }),
};
