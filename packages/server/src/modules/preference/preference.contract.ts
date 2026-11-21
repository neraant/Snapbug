import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { findUserPreferenceOutputDtoSchema } from "@workspace/validation/modules/preference/dto/find-user-preference.schema";
import {
  updateUserPreferenceInputDtoSchema,
  updateUserPreferenceOutputDtoSchema,
} from "@workspace/validation/modules/preference/dto/update-user-preference.schema";

export const preferenceContract = {
  findUserPreference: oc.output(findUserPreferenceOutputDtoSchema).route({
    method: "GET",
    path: "/user-preferences",
    tags: ["preference"],
    summary: "Find personal appearance and display preferences",
    spec: sessionAuthSpec,
  }),
  updateUserPreference: oc
    .input(updateUserPreferenceInputDtoSchema)
    .output(updateUserPreferenceOutputDtoSchema)
    .route({
      method: "POST",
      path: "/user-preferences",
      tags: ["preference"],
      summary: "Update personal appearance and display preferences",
      spec: sessionAuthSpec,
    }),
};
