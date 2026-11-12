import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import {
  findMembershipInputDtoSchema,
  findMembershipOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import { findMembershipByUserOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import {
  findMembershipProjectAccessInputDtoSchema,
  findMembershipProjectAccessOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/find-membership-project-access.schema";
import {
  findProjectMembersInputDtoSchema,
  findProjectMembersOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/find-project-members.schema";
import { findTeamMembersOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-team-members.schema";
import {
  removeMembershipInputDtoSchema,
  removeMembershipOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/remove-membership.schema";
import {
  replaceMembershipProjectAccessInputDtoSchema,
  replaceMembershipProjectAccessOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/replace-membership-project-access.schema";
import {
  updateMembershipRoleInputDtoSchema,
  updateMembershipRoleOutputDtoSchema,
} from "@workspace/validation/modules/membership/dto/update-membership-role.schema";

export const membershipContract = {
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
  findTeamMembers: oc.output(findTeamMembersOutputDtoSchema).route({
    method: "GET",
    path: "/team-members",
    tags: ["membership"],
    summary: "List team members",
    spec: sessionAuthSpec,
  }),
  findProjectMembers: oc
    .input(findProjectMembersInputDtoSchema)
    .output(findProjectMembersOutputDtoSchema)
    .route({
      method: "GET",
      path: "/project-members",
      tags: ["membership"],
      summary: "List people who can access a project",
      spec: sessionAuthSpec,
    }),
  updateMembershipRole: oc
    .input(updateMembershipRoleInputDtoSchema)
    .output(updateMembershipRoleOutputDtoSchema)
    .route({
      method: "PATCH",
      path: "/memberships/role",
      tags: ["membership"],
      summary: "Update membership role",
      spec: sessionAuthSpec,
    }),
  removeMembership: oc
    .input(removeMembershipInputDtoSchema)
    .output(removeMembershipOutputDtoSchema)
    .route({
      method: "DELETE",
      path: "/memberships",
      tags: ["membership"],
      summary: "Remove membership",
      spec: sessionAuthSpec,
    }),
  findMembershipProjectAccess: oc
    .input(findMembershipProjectAccessInputDtoSchema)
    .output(findMembershipProjectAccessOutputDtoSchema)
    .route({
      method: "GET",
      path: "/memberships/project-access",
      tags: ["membership"],
      summary: "Find membership project access",
      spec: sessionAuthSpec,
    }),
  replaceMembershipProjectAccess: oc
    .input(replaceMembershipProjectAccessInputDtoSchema)
    .output(replaceMembershipProjectAccessOutputDtoSchema)
    .route({
      method: "PUT",
      path: "/memberships/project-access",
      tags: ["membership"],
      summary: "Replace membership project access",
      spec: sessionAuthSpec,
    }),
};
