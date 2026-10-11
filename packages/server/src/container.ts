import { db } from "@workspace/database";
import { ApiKeyAdapter } from "@workspace/server/modules/api-key/adapter/api-key.adapter";
import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import { RequestPasswordResetUseCase } from "@workspace/server/modules/auth/application/request-password-reset.use-case";
import { ResetPasswordUseCase } from "@workspace/server/modules/auth/application/reset-password.use-case";
import { SignUpUseCase } from "@workspace/server/modules/auth/application/sign-up.use-case";
import { VerifyCredentialsUseCase } from "@workspace/server/modules/auth/application/verify-credentials.use-case";
import { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { FindBugReportsUseCase } from "@workspace/server/modules/bug-report/application/find-bug-reports.use-case";
import { FindChartsUseCase } from "@workspace/server/modules/bug-report/application/find-charts.use-case";
import { FindStatsUseCase } from "@workspace/server/modules/bug-report/application/find-stats.use-case";
import { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { UserAdapter } from "@workspace/server/modules/identity/adapter/user.adapter";
import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { FindUserCredentialsByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-credentials-by-email.use-case";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { AcceptInvitationUseCase } from "@workspace/server/modules/invitation/application/accept-invitation.use-case";
import { FindInvitationByTokenUseCase } from "@workspace/server/modules/invitation/application/find-invitation-by-token.use-case";
import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { OrganizationAdapter } from "@workspace/server/modules/organization/adapter/organization.adapter";
import { CompleteOnboardingUseCase } from "@workspace/server/modules/organization/application/complete-onboarding.use-case";
import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { UpdateOrganizationUseCase } from "@workspace/server/modules/organization/application/update-organization.use-case";
import { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import { withTransactionFactory } from "@workspace/server/shared/database/transaction.util";
import { resendClient } from "@workspace/server/shared/email/email.client";
import { EmailService } from "@workspace/server/shared/email/service/email.service";

const withTransaction = withTransactionFactory(db);

const authService = new AuthService();
const emailService = new EmailService(resendClient);
const bugReportStatService = new BugReportStatService();

const membershipRepository = new MembershipRepository();
const userRepository = new UserRepository();
const projectRepository = new ProjectRepository();
const organizationRepository = new OrganizationRepository();
const apiKeyRepository = new ApiKeyRepository();
const resetPasswordRepository = new ResetPasswordRepository();
const invitationRepository = new InvitationRepository();
const bugReportRepository = new BugReportRepository();
const auditLogRepository = new AuditLogRepository();
const auditLogService = new AuditLogService(auditLogRepository);
const bugReportService = new BugReportService(bugReportRepository, auditLogService);

const membershipAdapter = new MembershipAdapter(membershipRepository);
const userAdapter = new UserAdapter(userRepository);
const projectAdapter = new ProjectAdapter(projectRepository, membershipAdapter);
const organizationAdapter = new OrganizationAdapter(organizationRepository);
const apiKeyAdapter = new ApiKeyAdapter(apiKeyRepository, projectAdapter);

const createMembership = new CreateMembershipUseCase(membershipRepository);
const findMembership = new FindMembershipUseCase(membershipRepository);
const findMembershipByUser = new FindMembershipByUserUseCase(membershipRepository);

const createUser = new CreateUserUseCase(userRepository);
const findUserByEmail = new FindUserByEmailUseCase(userRepository);
const findUserCredentialsByEmail = new FindUserCredentialsByEmailUseCase(userRepository);

const createProject = new CreateProjectUseCase(membershipAdapter, projectRepository);
const findProjects = new FindProjectsUseCase(projectRepository);
const updateProject = new UpdateProjectUseCase(membershipAdapter, projectRepository);

const findOnboarding = new FindOnboardingUseCase(
  userAdapter,
  membershipAdapter,
  organizationRepository,
  projectAdapter,
);
const createOrganization = new CreateOrganizationUseCase(organizationRepository, membershipAdapter, projectAdapter);
const updateOrganization = new UpdateOrganizationUseCase(membershipAdapter, organizationRepository);
const completeOnboarding = new CompleteOnboardingUseCase(
  userAdapter,
  membershipAdapter,
  organizationRepository,
  projectAdapter,
  findOnboarding,
  withTransaction,
);

const signUp = new SignUpUseCase(authService, userAdapter);
const verifyCredentials = new VerifyCredentialsUseCase(authService, userAdapter);
const requestResetPassword = new RequestPasswordResetUseCase(
  resetPasswordRepository,
  userAdapter,
  authService,
  emailService,
  withTransaction,
);
const resetPassword = new ResetPasswordUseCase(resetPasswordRepository, userAdapter, authService);

const sendInvitations = new SendInvitationsUseCase(
  invitationRepository,
  membershipAdapter,
  userAdapter,
  authService,
  emailService,
);
const findInvitationByToken = new FindInvitationByTokenUseCase(invitationRepository, organizationAdapter);
const acceptInvitation = new AcceptInvitationUseCase(
  invitationRepository,
  membershipAdapter,
  membershipRepository,
  withTransaction,
);

const findProjectByKey = new FindProjectByKeyUseCase(apiKeyRepository, projectAdapter);
const createBugReport = new CreateBugReportUseCase(apiKeyAdapter, bugReportService, withTransaction);
const findBugReports = new FindBugReportsUseCase(membershipAdapter, projectAdapter, bugReportRepository);
const findStats = new FindStatsUseCase(
  membershipAdapter,
  projectAdapter,
  bugReportRepository,
  bugReportStatService,
  auditLogRepository,
);
const findCharts = new FindChartsUseCase(membershipAdapter, projectAdapter, bugReportRepository, bugReportStatService);

export const container = {
  membership: { createMembership, findMembership, findMembershipByUser },
  identity: { createUser, findUserByEmail, findUserCredentialsByEmail },
  project: { createProject, findProjects, updateProject },
  organization: { findOnboarding, createOrganization, updateOrganization, completeOnboarding },
  apiKey: { findProjectByKey },
  auth: { signUp, verifyCredentials, requestResetPassword, resetPassword },
  invitation: { sendInvitations, findInvitationByToken, acceptInvitation },
  bugReport: { createBugReport, findBugReports, findStats, findCharts },
};
