import { JSON_SCHEMA_REGISTRY } from "@orpc/zod/zod4";
import { findProjectByKeyInputDtoSchema } from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";
import { verifyCredentialsInputDtoSchema } from "@workspace/validation/modules/auth/dto/verify-credentials.schema";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { createBugReportInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import { findBreakdownsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import { findBugReportsOutputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";
import { findChartsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import { findOneInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-one.schema";
import { findRecentInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-recent.schema";
import { findReplayInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-replay.schema";
import { findScreenshotInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-screenshot.schema";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { findWorkloadInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-workload.schema";
import { acceptInvitationInputDtoSchema } from "@workspace/validation/modules/invitation/dto/accept-invitation.schema";
import {
  findInvitationByTokenInputDtoSchema,
  findInvitationByTokenOutputDtoSchema,
} from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import { sendInvitationsInputDtoSchema } from "@workspace/validation/modules/invitation/dto/send-invitation.schema";
import { createMembershipInputDtoSchema } from "@workspace/validation/modules/membership/dto/create-membership.schema";
import { findMembershipInputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership.schema";
import { findMembershipByUserOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { completeOnboardingInputDtoSchema } from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import {
  createOrganizationInputDtoSchema,
  createOrganizationOutputDtoSchema,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import { findOnboardingOutputDtoSchema } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { organizationModelSchema } from "@workspace/validation/modules/organization/dto/organization.model";
import { updateOnboardingOrganizationInputDtoSchema } from "@workspace/validation/modules/organization/dto/update-onboarding-organization.schema";
import { updateOrganizationInputDtoSchema } from "@workspace/validation/modules/organization/dto/update-organization.schema";
import { createProjectInputDtoSchema } from "@workspace/validation/modules/project/dto/create-project.schema";
import { findProjectsOutputDtoSchema } from "@workspace/validation/modules/project/dto/find-projects.schema";
import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
import { updateProjectInputDtoSchema } from "@workspace/validation/modules/project/dto/update-project.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import {
  createUserInputDtoSchema,
  createUserWithPasswordHashInputDtoSchema,
} from "@workspace/validation/modules/user/dto/create-user.schema";
import { findUserByEmailInputDtoSchema } from "@workspace/validation/modules/user/dto/find-user-by-email.schema";
import { findUserCredentialsByEmailInputDtoSchema } from "@workspace/validation/modules/user/dto/find-user-credentials-by-email.schema";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";

JSON_SCHEMA_REGISTRY.add(userModelSchema, {
  title: "User",
  description: "Public user profile",
  examples: [
    {
      id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      name: "Jane Doe",
      email: "user@example.com",
      onboardingCompletedAt: null,
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(createUserInputDtoSchema, {
  title: "Sign up",
  description: "Create an account",
  examples: [{ email: "user@example.com", name: "Jane Doe", password: "password1" }],
});

JSON_SCHEMA_REGISTRY.add(bugReportModelSchema, {
  title: "Bug report",
  description: "A reported bug for a project",
  examples: [
    {
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
      projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      shortId: "SNB-1",
      assignedTo: null,
      status: BugReportStatus.NEW,
      boardOrder: 1024,
      severity: BugReportSeverity.MEDIUM,
      title: "Pay button throws when the cart is empty",
      description: "Clicking Pay on an empty cart shows a blank page.",
      stepsToReproduce: null,
      reporterEmail: null,
      url: "https://store.acme.test/checkout",
      userAgent: null,
      browser: null,
      os: null,
      device: null,
      viewportWidth: null,
      viewportHeight: null,
      hasReplay: false,
      hasScreenshot: true,
      consoleLogs: null,
      networkLogs: null,
      customContext: null,
      createdAt: "2026-10-03T09:00:00.000Z",
      updatedAt: "2026-10-03T09:00:00.000Z",
      resolvedAt: null,
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findBugReportsOutputDtoSchema, {
  title: "List bug reports",
  description: "Bug reports for the caller's organization",
});

JSON_SCHEMA_REGISTRY.add(findStatsInputDtoSchema, {
  title: "Bug report stats",
  description: "Overview stat cards for the caller's organization",
  examples: [{ periodDays: 30 }],
});

JSON_SCHEMA_REGISTRY.add(findChartsInputDtoSchema, {
  title: "Bug report charts",
  description: "Overview charts for the caller's organization",
  examples: [{ periodDays: 30 }],
});

JSON_SCHEMA_REGISTRY.add(findBreakdownsInputDtoSchema, {
  title: "Bug report breakdowns",
  description: "Overview breakdown cards for the caller's organization",
  examples: [{ periodDays: 30 }],
});

JSON_SCHEMA_REGISTRY.add(findOneInputDtoSchema, {
  title: "Find bug report",
  description: "Load one bug report by short id for the caller's organization",
  examples: [{ shortId: "SNB-1" }],
});

JSON_SCHEMA_REGISTRY.add(findScreenshotInputDtoSchema, {
  title: "Bug report screenshot",
  description: "Load the screenshot image for a bug report in the caller's organization",
  examples: [{ shortId: "SNB-1" }],
});

JSON_SCHEMA_REGISTRY.add(findReplayInputDtoSchema, {
  title: "Bug report replay",
  description: "Load the session replay payload for a bug report in the caller's organization",
  examples: [{ shortId: "SNB-1" }],
});

JSON_SCHEMA_REGISTRY.add(findRecentInputDtoSchema, {
  title: "Recent bug reports",
  description: "The latest bug reports for the caller's organization",
  examples: [{}],
});

JSON_SCHEMA_REGISTRY.add(findWorkloadInputDtoSchema, {
  title: "Bug report workload",
  description: "Open bug reports per teammate for the caller's organization",
  examples: [{}],
});

JSON_SCHEMA_REGISTRY.add(verifyCredentialsInputDtoSchema, {
  title: "Verify credentials",
  description: "Check an email and password",
  examples: [{ email: "user@example.com", password: "password1" }],
});

JSON_SCHEMA_REGISTRY.add(createUserWithPasswordHashInputDtoSchema, {
  title: "Create user",
  description: "Create a user from an already hashed password",
  examples: [{ email: "user@example.com", name: "Jane Doe", passwordHash: "hashed" }],
});

JSON_SCHEMA_REGISTRY.add(findUserByEmailInputDtoSchema, {
  title: "Find user by email",
  description: "Public profile for an email",
  examples: [{ email: "user@example.com" }],
});

JSON_SCHEMA_REGISTRY.add(findUserCredentialsByEmailInputDtoSchema, {
  title: "Find user credentials by email",
  description: "Stored credentials for an email",
  examples: [{ email: "user@example.com" }],
});

JSON_SCHEMA_REGISTRY.add(membershipModelSchema, {
  title: "Membership",
  description: "A user's membership in an organization",
  examples: [
    {
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      userId: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      role: UserRole.USER,
      createdAt: "2026-10-03T09:00:00.000Z",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findMembershipInputDtoSchema, {
  title: "Find membership",
  description: "Membership of a user in an organization",
  examples: [
    {
      userId: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(organizationModelSchema, {
  title: "Organization",
  description: "An organization workspace",
  examples: [
    {
      id: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Acme",
      reports_retention_days: 90,
      createdAt: "2026-10-03T09:00:00.000Z",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(createOrganizationInputDtoSchema, {
  title: "Create organization",
  description: "Create an organization workspace",
  examples: [{ name: "Acme" }],
});

JSON_SCHEMA_REGISTRY.add(createOrganizationOutputDtoSchema, {
  title: "Created organization workspace",
  description: "Organization and its default project",
});

JSON_SCHEMA_REGISTRY.add(createMembershipInputDtoSchema, {
  title: "Create membership",
  description: "Admin membership for an organization that has no members yet",
  examples: [{ organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1" }],
});

JSON_SCHEMA_REGISTRY.add(updateOrganizationInputDtoSchema, {
  title: "Update organization",
  description: "Update organization settings",
  examples: [{ organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1", name: "Acme" }],
});

JSON_SCHEMA_REGISTRY.add(updateOnboardingOrganizationInputDtoSchema, {
  title: "Update organization during onboarding",
  description: "Rename an organization the current user belongs to before onboarding is complete",
  examples: [{ organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1", name: "Acme" }],
});

JSON_SCHEMA_REGISTRY.add(findOnboardingOutputDtoSchema, {
  title: "Onboarding snapshot",
  description: "Onboarding completion flag, organization, and oldest project for the current user",
  examples: [
    {
      completedAt: "2026-10-05T12:00:00.000Z",
      suggestedOrganizationName: "Alex",
      organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      organizationName: "Acme",
      projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      projectName: "Default project",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(completeOnboardingInputDtoSchema, {
  title: "Complete onboarding",
  description: "Ensure a workspace exists and mark onboarding complete",
  examples: [{ organizationName: "Acme", projectName: "Default project" }],
});

JSON_SCHEMA_REGISTRY.add(findMembershipByUserOutputDtoSchema, {
  title: "Membership for current user",
  description: "Membership of the authenticated user, if any",
});

JSON_SCHEMA_REGISTRY.add(projectModelSchema, {
  title: "Project",
  description: "A project in an organization",
  examples: [
    {
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Store",
      color: "#F97316",
      organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      createdAt: "2026-10-03T09:00:00.000Z",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(createProjectInputDtoSchema, {
  title: "Create project",
  description: "Create a project in an organization",
  examples: [{ organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1", name: "Store", color: "#F97316" }],
});

JSON_SCHEMA_REGISTRY.add(updateProjectInputDtoSchema, {
  title: "Update project",
  description: "Update project settings",
  examples: [
    {
      projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Store",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findProjectsOutputDtoSchema, {
  title: "List projects",
  description: "Projects in the caller's organization",
});

JSON_SCHEMA_REGISTRY.add(findProjectByKeyInputDtoSchema, {
  title: "Find project by key",
  description: "Project for a key that is still active",
  examples: [{ key: "ff_live_example" }],
});

JSON_SCHEMA_REGISTRY.add(sendInvitationsInputDtoSchema, {
  title: "Send invitations",
  description: "Email organization invitations to teammates",
  examples: [
    {
      organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      emails: ["teammate@example.com"],
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findInvitationByTokenInputDtoSchema, {
  title: "Find invitation by token",
  description: "Public invitation details for sign-up",
  examples: [{ token: "550e8400-e29b-41d4-a716-446655440000" }],
});

JSON_SCHEMA_REGISTRY.add(findInvitationByTokenOutputDtoSchema, {
  title: "Invitation preview",
  description: "Invited email and organization name",
  examples: [{ email: "teammate@example.com", organizationName: "Acme" }],
});

JSON_SCHEMA_REGISTRY.add(acceptInvitationInputDtoSchema, {
  title: "Accept invitation",
  description: "Join an organization with a valid invitation token",
  examples: [{ token: "550e8400-e29b-41d4-a716-446655440000" }],
});

JSON_SCHEMA_REGISTRY.add(createBugReportInputDtoSchema, {
  title: "Create bug report",
  description: "Report a bug with a project API key",
  examples: [
    {
      apiKey: "ff_live_example",
      title: "Pay button throws when the cart is empty",
      description: "Clicking Pay on an empty cart shows a blank page.",
      url: "https://store.acme.test/checkout",
    },
  ],
});
