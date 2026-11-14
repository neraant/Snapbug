import { db } from "@workspace/database";
import { ApiKeyAdapter } from "@workspace/server/modules/api-key/adapter/api-key.adapter";
import { FindProjectApiKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-api-key.use-case";
import { FindProjectByKeyUseCase } from "@workspace/server/modules/api-key/application/find-project-by-key.use-case";
import { RotateProjectApiKeyUseCase } from "@workspace/server/modules/api-key/application/rotate-project-api-key.use-case";
import { ApiKeyRepository } from "@workspace/server/modules/api-key/repository/api-key.repository";
import { ApiKeyService } from "@workspace/server/modules/api-key/service/api-key.service";
import { FindActivityLogsUseCase } from "@workspace/server/modules/audit/application/find-activity-logs.use-case";
import { RequestPasswordResetUseCase } from "@workspace/server/modules/auth/application/request-password-reset.use-case";
import { ResetPasswordUseCase } from "@workspace/server/modules/auth/application/reset-password.use-case";
import { SignUpUseCase } from "@workspace/server/modules/auth/application/sign-up.use-case";
import { VerifyCredentialsUseCase } from "@workspace/server/modules/auth/application/verify-credentials.use-case";
import { ResetPasswordRepository } from "@workspace/server/modules/auth/repository/reset-password.repository";
import { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { BugReportAdapter } from "@workspace/server/modules/bug-report/adapter/bug-report.adapter";
import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import { CountOpenByAssigneeUseCase } from "@workspace/server/modules/bug-report/application/count-open-by-assignee.use-case";
import { CountOpenByProjectUseCase } from "@workspace/server/modules/bug-report/application/count-open-by-project.use-case";
import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { FindBreakdownsUseCase } from "@workspace/server/modules/bug-report/application/find-breakdowns.use-case";
import { FindBugReportsUseCase } from "@workspace/server/modules/bug-report/application/find-bug-reports.use-case";
import { FindChartsUseCase } from "@workspace/server/modules/bug-report/application/find-charts.use-case";
import { FindOneUseCase } from "@workspace/server/modules/bug-report/application/find-one.use-case";
import { FindRecentUseCase } from "@workspace/server/modules/bug-report/application/find-recent.use-case";
import { FindReplayUseCase } from "@workspace/server/modules/bug-report/application/find-replay.use-case";
import { FindScreenshotUseCase } from "@workspace/server/modules/bug-report/application/find-screenshot.use-case";
import { FindStatsUseCase } from "@workspace/server/modules/bug-report/application/find-stats.use-case";
import { FindWidgetConfigUseCase } from "@workspace/server/modules/bug-report/application/find-widget-config.use-case";
import { FindWorkloadUseCase } from "@workspace/server/modules/bug-report/application/find-workload.use-case";
import { ListTicketsUseCase } from "@workspace/server/modules/bug-report/application/list-tickets.use-case";
import { UpdateBugReportUseCase } from "@workspace/server/modules/bug-report/application/update-bug-report.use-case";
import { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { WidgetIngestOriginService } from "@workspace/server/modules/bug-report/service/widget-ingest-origin.service";
import { WidgetIngestRateLimitService } from "@workspace/server/modules/bug-report/service/widget-ingest-rate-limit.service";
import { WidgetUserAgentService } from "@workspace/server/modules/bug-report/service/widget-user-agent.service";
import { AddCommentUseCase } from "@workspace/server/modules/comment/application/add-comment.use-case";
import { FindCommentsUseCase } from "@workspace/server/modules/comment/application/find-comments.use-case";
import { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import { CommentService } from "@workspace/server/modules/comment/service/comment.service";
import { UserAdapter } from "@workspace/server/modules/identity/adapter/user.adapter";
import { CreateUserUseCase } from "@workspace/server/modules/identity/application/create-user.use-case";
import { FindUserByEmailUseCase } from "@workspace/server/modules/identity/application/find-user-by-email.use-case";
import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { AcceptInvitationUseCase } from "@workspace/server/modules/invitation/application/accept-invitation.use-case";
import { FindInvitationByTokenUseCase } from "@workspace/server/modules/invitation/application/find-invitation-by-token.use-case";
import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { FindMembershipProjectAccessUseCase } from "@workspace/server/modules/membership/application/find-membership-project-access.use-case";
import { FindMembershipsByUserUseCase } from "@workspace/server/modules/membership/application/find-memberships-by-user.use-case";
import { FindProjectMembersUseCase } from "@workspace/server/modules/membership/application/find-project-members.use-case";
import { FindTeamMembersUseCase } from "@workspace/server/modules/membership/application/find-team-members.use-case";
import { RemoveMembershipUseCase } from "@workspace/server/modules/membership/application/remove-membership.use-case";
import { ReplaceMembershipProjectAccessUseCase } from "@workspace/server/modules/membership/application/replace-membership-project-access.use-case";
import { UpdateMembershipRoleUseCase } from "@workspace/server/modules/membership/application/update-membership-role.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { MembershipService } from "@workspace/server/modules/membership/service/membership.service";
import { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import { OrganizationAdapter } from "@workspace/server/modules/organization/adapter/organization.adapter";
import { CompleteOnboardingUseCase } from "@workspace/server/modules/organization/application/complete-onboarding.use-case";
import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { FindOrganizationsUseCase } from "@workspace/server/modules/organization/application/find-organizations.use-case";
import { UpdateOnboardingOrganizationUseCase } from "@workspace/server/modules/organization/application/update-onboarding-organization.use-case";
import { UpdateOrganizationUseCase } from "@workspace/server/modules/organization/application/update-organization.use-case";
import { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { OrganizationService } from "@workspace/server/modules/organization/service/organization.service";
import { AuditProjectAdapter } from "@workspace/server/modules/project/adapter/audit-project.adapter";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { FindProjectWidgetSettingUseCase } from "@workspace/server/modules/project/application/find-project-widget-setting.use-case";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { UpdateProjectWidgetSettingUseCase } from "@workspace/server/modules/project/application/update-project-widget-setting.use-case";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { ProjectService } from "@workspace/server/modules/project/service/project.service";
import { CreateUserTokenUseCase } from "@workspace/server/modules/user-token/application/create-user-token.use-case";
import { FindUserByTokenUseCase } from "@workspace/server/modules/user-token/application/find-user-by-token.use-case";
import { FindUserTokensUseCase } from "@workspace/server/modules/user-token/application/find-user-tokens.use-case";
import { RevokeUserTokenUseCase } from "@workspace/server/modules/user-token/application/revoke-user-token.use-case";
import { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import { withTransactionFactory } from "@workspace/server/shared/database/transaction.util";
import { resendClient } from "@workspace/server/shared/email/email.client";
import { EmailService } from "@workspace/server/shared/email/service/email.service";
import { env } from "@workspace/server/shared/env/env.schema";

const withTransaction = withTransactionFactory(db);

const authService = new AuthService();
const emailService = new EmailService(resendClient);
const bugReportStatService = new BugReportStatService();

const membershipRepository = new MembershipRepository();
const projectAccessRepository = new ProjectAccessRepository();
const userRepository = new UserRepository();
const projectRepository = new ProjectRepository();
const organizationRepository = new OrganizationRepository();
const apiKeyRepository = new ApiKeyRepository();
const resetPasswordRepository = new ResetPasswordRepository();
const invitationRepository = new InvitationRepository();
const bugReportRepository = new BugReportRepository();
const commentRepository = new CommentRepository();
const auditLogRepository = new AuditLogRepository();
const auditProjectAdapter = new AuditProjectAdapter(projectRepository);
const auditLogService = new AuditLogService(auditLogRepository, auditProjectAdapter);
const organizationService = new OrganizationService(organizationRepository, auditLogService);
const membershipService = new MembershipService(membershipRepository, auditLogService);
const invitationService = new InvitationService(invitationRepository, auditLogService);
const commentService = new CommentService(commentRepository, auditLogService);
const bugReportService = new BugReportService(bugReportRepository, auditLogService);
const projectService = new ProjectService(projectRepository, auditLogService);
const apiKeyService = new ApiKeyService(apiKeyRepository, auditLogService);
const widgetIngestOriginService = new WidgetIngestOriginService();
const widgetIngestRateLimitService = new WidgetIngestRateLimitService();
const widgetUserAgentService = new WidgetUserAgentService();
const bugReportFileStorage = new VercelBlobFileStorageAdapter(env.BLOB_READ_WRITE_TOKEN);

const projectAccessService = new ProjectAccessService(projectAccessRepository, auditLogService);
const membershipAdapter = new MembershipAdapter(
  membershipRepository,
  projectAccessRepository,
  projectAccessService,
  membershipService,
);
const userAdapter = new UserAdapter(userRepository);
const projectAdapter = new ProjectAdapter(projectRepository, membershipAdapter, projectService, withTransaction);
const organizationAdapter = new OrganizationAdapter(organizationRepository);
const apiKeyAdapter = new ApiKeyAdapter(apiKeyRepository, projectAdapter);
const bugReportAdapter = new BugReportAdapter(bugReportRepository);

const findMembership = new FindMembershipUseCase(membershipRepository);
const findMembershipByUser = new FindMembershipByUserUseCase(membershipRepository);
const findMembershipsByUser = new FindMembershipsByUserUseCase(membershipRepository);
const findTeamMembers = new FindTeamMembersUseCase(membershipRepository, userAdapter);
const findProjectMembers = new FindProjectMembersUseCase(
  membershipRepository,
  projectAccessRepository,
  projectAdapter,
  userAdapter,
);
const updateMembershipRole = new UpdateMembershipRoleUseCase(membershipRepository, membershipService, withTransaction);
const removeMembership = new RemoveMembershipUseCase(membershipRepository, membershipService, withTransaction);
const findMembershipProjectAccess = new FindMembershipProjectAccessUseCase(
  membershipRepository,
  projectAccessRepository,
  projectAdapter,
);
const replaceMembershipProjectAccess = new ReplaceMembershipProjectAccessUseCase(
  membershipRepository,
  projectAccessRepository,
  projectAdapter,
  projectAccessService,
  withTransaction,
);

const createUser = new CreateUserUseCase(userRepository);
const findUserByEmail = new FindUserByEmailUseCase(userRepository);

const createProject = new CreateProjectUseCase(membershipAdapter, projectService, withTransaction);
const findProjects = new FindProjectsUseCase(membershipAdapter, projectRepository);
const updateProject = new UpdateProjectUseCase(membershipAdapter, projectRepository, projectService, withTransaction);
const findProjectWidgetSetting = new FindProjectWidgetSettingUseCase(membershipAdapter, projectRepository);
const updateProjectWidgetSetting = new UpdateProjectWidgetSettingUseCase(
  membershipAdapter,
  projectRepository,
  projectService,
  withTransaction,
);

const findOrganizations = new FindOrganizationsUseCase(membershipAdapter, organizationRepository);
const findOnboarding = new FindOnboardingUseCase(
  userAdapter,
  membershipAdapter,
  organizationRepository,
  projectAdapter,
);
const createOrganization = new CreateOrganizationUseCase(
  organizationService,
  membershipAdapter,
  projectAdapter,
  withTransaction,
);
const updateOrganization = new UpdateOrganizationUseCase(
  membershipAdapter,
  organizationRepository,
  organizationService,
  withTransaction,
);
const updateOnboardingOrganization = new UpdateOnboardingOrganizationUseCase(
  userAdapter,
  membershipAdapter,
  organizationRepository,
  organizationService,
  withTransaction,
);
const completeOnboarding = new CompleteOnboardingUseCase(
  userAdapter,
  membershipAdapter,
  organizationService,
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
  invitationService,
  membershipAdapter,
  userAdapter,
  organizationAdapter,
  authService,
  emailService,
  withTransaction,
);
const findInvitationByToken = new FindInvitationByTokenUseCase(
  invitationService,
  invitationRepository,
  organizationAdapter,
);
const acceptInvitation = new AcceptInvitationUseCase(
  invitationRepository,
  membershipAdapter,
  projectAdapter,
  withTransaction,
  invitationService,
);
const findActivityLogs = new FindActivityLogsUseCase(membershipAdapter, userAdapter, auditLogRepository);

const findProjectByKey = new FindProjectByKeyUseCase(apiKeyRepository, projectAdapter);
const findProjectApiKey = new FindProjectApiKeyUseCase(
  membershipAdapter,
  projectAdapter,
  apiKeyRepository,
  apiKeyService,
  withTransaction,
);
const rotateProjectApiKey = new RotateProjectApiKeyUseCase(
  membershipAdapter,
  projectAdapter,
  apiKeyRepository,
  apiKeyService,
  withTransaction,
);
const createBugReport = new CreateBugReportUseCase(
  apiKeyAdapter,
  projectAdapter,
  bugReportService,
  withTransaction,
  widgetIngestOriginService,
  widgetUserAgentService,
  bugReportFileStorage,
  widgetIngestRateLimitService,
);
const findWidgetConfig = new FindWidgetConfigUseCase(apiKeyAdapter, projectAdapter, widgetIngestOriginService);
const findBugReports = new FindBugReportsUseCase(membershipAdapter, projectAdapter, bugReportRepository);
const findOne = new FindOneUseCase(membershipAdapter, userAdapter, bugReportRepository);
const findScreenshot = new FindScreenshotUseCase(membershipAdapter, bugReportRepository, bugReportFileStorage);
const findReplay = new FindReplayUseCase(membershipAdapter, bugReportRepository, bugReportFileStorage);
const findStats = new FindStatsUseCase(
  membershipAdapter,
  projectAdapter,
  bugReportRepository,
  bugReportStatService,
  auditLogRepository,
);
const findCharts = new FindChartsUseCase(membershipAdapter, projectAdapter, bugReportRepository, bugReportStatService);
const findBreakdowns = new FindBreakdownsUseCase(
  membershipAdapter,
  projectAdapter,
  bugReportRepository,
  bugReportStatService,
);
const findRecent = new FindRecentUseCase(membershipAdapter, projectAdapter, userAdapter, bugReportRepository);
const findWorkload = new FindWorkloadUseCase(membershipAdapter, projectAdapter, userAdapter, bugReportRepository);
const countOpenByProject = new CountOpenByProjectUseCase(membershipAdapter, projectAdapter, bugReportRepository);
const countOpenByAssignee = new CountOpenByAssigneeUseCase(membershipAdapter, projectAdapter, bugReportRepository);
const updateBugReport = new UpdateBugReportUseCase(
  membershipAdapter,
  projectAdapter,
  bugReportRepository,
  bugReportService,
  withTransaction,
);
const listTickets = new ListTicketsUseCase(membershipAdapter, projectAdapter, bugReportRepository);
const userTokenRepository = new UserTokenRepository();
const userTokenService = new UserTokenService();
const createUserToken = new CreateUserTokenUseCase(userTokenService, userTokenRepository);
const findUserTokens = new FindUserTokensUseCase(userTokenRepository);
const revokeUserToken = new RevokeUserTokenUseCase(userTokenRepository);
const findUserByToken = new FindUserByTokenUseCase(userTokenService, userTokenRepository, userAdapter);
const addComment = new AddCommentUseCase(
  bugReportAdapter,
  projectAdapter,
  membershipAdapter,
  userAdapter,
  commentService,
  withTransaction,
);
const findComments = new FindCommentsUseCase(
  bugReportAdapter,
  projectAdapter,
  membershipAdapter,
  userAdapter,
  commentRepository,
);

export const container = {
  audit: { findActivityLogs },
  membership: {
    findMembership,
    findMembershipByUser,
    findMembershipsByUser,
    findTeamMembers,
    findProjectMembers,
    updateMembershipRole,
    removeMembership,
    findMembershipProjectAccess,
    replaceMembershipProjectAccess,
  },
  identity: { createUser, findUserByEmail },
  project: { createProject, findProjects, updateProject, findProjectWidgetSetting, updateProjectWidgetSetting },
  organization: {
    findOnboarding,
    findOrganizations,
    createOrganization,
    updateOrganization,
    updateOnboardingOrganization,
    completeOnboarding,
  },
  apiKey: { findProjectByKey, findProjectApiKey, rotateProjectApiKey },
  auth: { signUp, verifyCredentials, requestResetPassword, resetPassword },
  invitation: { sendInvitations, findInvitationByToken, acceptInvitation },
  bugReport: {
    createBugReport,
    findWidgetConfig,
    findBugReports,
    findOne,
    findScreenshot,
    findReplay,
    findStats,
    findCharts,
    findBreakdowns,
    findRecent,
    findWorkload,
    countOpenByProject,
    countOpenByAssignee,
    updateBugReport,
    listTickets,
  },
  userToken: {
    create: createUserToken,
    findMany: findUserTokens,
    revoke: revokeUserToken,
    findUserByToken,
  },
  comment: {
    addComment,
    findComments,
  },
};
