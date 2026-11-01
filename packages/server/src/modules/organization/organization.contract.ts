import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  completeOnboardingInputDtoSchema,
  completeOnboardingOutputDtoSchema,
} from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import {
  createOrganizationInputDtoSchema,
  createOrganizationOutputDtoSchema,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import { findOnboardingOutputDtoSchema } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { findOrganizationsOutputDtoSchema } from "@workspace/validation/modules/organization/dto/find-organizations.schema";
import { organizationModelSchema } from "@workspace/validation/modules/organization/dto/organization.model";
import {
  updateOnboardingOrganizationInputDtoSchema,
  updateOnboardingOrganizationOutputDtoSchema,
} from "@workspace/validation/modules/organization/dto/update-onboarding-organization.schema";
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
  findOrganizations: oc.output(findOrganizationsOutputDtoSchema).route({
    method: "GET",
    path: "/organizations",
    tags: ["organization"],
    summary: "List organizations for the current user",
    spec: sessionAuthSpec,
  }),
  updateOnboardingOrganization: oc
    .input(updateOnboardingOrganizationInputDtoSchema)
    .output(updateOnboardingOrganizationOutputDtoSchema)
    .route({
      method: "PATCH",
      path: "/organizations/onboarding",
      tags: ["organization"],
      summary: "Rename the joined organization during onboarding",
      spec: sessionAuthSpec,
    }),
  findOnboarding: oc.output(findOnboardingOutputDtoSchema).route({
    method: "GET",
    path: "/organizations/onboarding",
    tags: ["organization"],
    summary: "Find onboarding snapshot for the current user",
    spec: sessionAuthSpec,
  }),
  completeOnboarding: oc
    .input(completeOnboardingInputDtoSchema)
    .output(completeOnboardingOutputDtoSchema)
    .route({
      method: "POST",
      path: "/organizations/onboarding/complete",
      tags: ["organization"],
      summary: "Finish onboarding and ensure a workspace exists",
      spec: sessionAuthSpec,
    }),
};
