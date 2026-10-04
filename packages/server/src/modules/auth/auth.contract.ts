import { oc } from "@orpc/contract";
import {
  requestResetPasswordInputDtoSchema,
  requestResetPasswordOutputDtoSchema,
} from "@workspace/validation/modules/auth/dto/request-reset-password.schema";
import {
  resetPasswordInputDtoSchema,
  resetPasswordOutputDtoSchema,
} from "@workspace/validation/modules/auth/dto/reset-password.schema";
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
  requestResetPassword: oc
    .input(requestResetPasswordInputDtoSchema)
    .output(requestResetPasswordOutputDtoSchema)
    .route({ method: "POST", path: "/auth/request-reset-password", tags: ["auth"], summary: "Request reset password" }),
  resetPassword: oc
    .input(resetPasswordInputDtoSchema)
    .output(resetPasswordOutputDtoSchema)
    .route({ method: "POST", path: "/auth/reset-password", tags: ["auth"], summary: "Reset password" }),
};
