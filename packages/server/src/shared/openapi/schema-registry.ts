import { JSON_SCHEMA_REGISTRY } from "@orpc/zod/zod4";
import { findProjectByKeyInputDtoSchema } from "@workspace/validation/modules/api-key/dto/find-project-by-key.schema";
import { verifyCredentialsInputDtoSchema } from "@workspace/validation/modules/auth/dto/verify-credentials.schema";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { createBugReportInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import { findBugReportsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";
import { findMembershipInputDtoSchema } from "@workspace/validation/modules/membership/dto/find-membership.schema";
import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import { findProjectsInputDtoSchema } from "@workspace/validation/modules/project/dto/find-projects.schema";
import { projectModelSchema } from "@workspace/validation/modules/project/dto/project.model";
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
  examples: [{ id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4", name: "Jane Doe", email: "user@example.com" }],
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
      assignedTo: null,
      status: BugReportStatus.NEW,
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
      consoleLogs: null,
      networkLogs: null,
      customContext: null,
      createdAt: "2026-10-03T09:00:00.000Z",
      updatedAt: "2026-10-03T09:00:00.000Z",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findBugReportsInputDtoSchema, {
  title: "List bug reports",
  description: "Bug reports for an organization the caller belongs to",
  examples: [{ organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1" }],
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

JSON_SCHEMA_REGISTRY.add(projectModelSchema, {
  title: "Project",
  description: "A project in an organization",
  examples: [
    {
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      name: "Store",
      organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      createdAt: "2026-10-03T09:00:00.000Z",
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(findProjectsInputDtoSchema, {
  title: "List projects",
  description: "Projects in an organization",
  examples: [{ organizationId: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1" }],
});

JSON_SCHEMA_REGISTRY.add(findProjectByKeyInputDtoSchema, {
  title: "Find project by key",
  description: "Project for a key that is still active",
  examples: [{ key: "ff_live_example" }],
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
