import { oc } from "@orpc/contract";
import {
  createUserInputDtoSchema,
  createUserOutputDtoSchema,
} from "@workspace/validation/modules/user/dto/create-user.schema";

export const authContract = {
  signUp: oc
    .input(createUserInputDtoSchema)
    .output(createUserOutputDtoSchema)
    .route({ method: "POST", path: "/auth/sign-up", tags: ["auth"], summary: "Sign up" }),
};
