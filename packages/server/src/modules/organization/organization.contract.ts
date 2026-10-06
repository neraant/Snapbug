import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  createOrganizationInputDtoSchema,
  createOrganizationOutputDtoSchema,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import { findOnboardingOutputDtoSchema } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { organizationModelSchema } from "@workspace/validation/modules/organization/dto/organization.model";
import { updateOrganizationInputDtoSchema } from "@workspace/validation/modules/organization/dto/update-organization.schema";

export const organizationContract = {
  createOrganization: oc
    .input(createOrganizationInputDtoSchema)
    .output(createOrganizationOutputDtoSchema)
    .route({
      method: "POST",
      path: "/organizations",
      tags: ["organization"],
      summary: "Create organization",
      spec: sessionAuthSpec,
    }),
  updateOrganization: oc
    .input(updateOrganizationInputDtoSchema)
    .output(organizationModelSchema)
    .route({
      method: "PATCH",
      path: "/organizations",
      tags: ["organization"],
      summary: "Update organization",
      spec: sessionAuthSpec,
    }),
  findOnboarding: oc.output(findOnboardingOutputDtoSchema).route({
    method: "GET",
    path: "/organizations/onboarding",
    tags: ["organization"],
    summary: "Find onboarding snapshot for the current user",
    spec: sessionAuthSpec,
  }),
};
