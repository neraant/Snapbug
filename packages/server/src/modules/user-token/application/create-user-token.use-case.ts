import { UserTokenFactory } from "@workspace/server/modules/user-token/entity/user-token.factory";
import { UserTokenMapper } from "@workspace/server/modules/user-token/entity/user-token.mapper";
import type { MembershipPort } from "@workspace/server/modules/user-token/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/user-token/port/project.port";
import type { UserTokenRepository } from "@workspace/server/modules/user-token/repository/user-token.repository";
import type { UserTokenService } from "@workspace/server/modules/user-token/service/user-token.service";
import { BadRequestError, ForbiddenError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import {
  expandMcpScopes,
  type McpToolScopeType,
  presetScopes,
  type UserTokenScopePresetType,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import type {
  CreateUserTokenInputDtoType,
  CreateUserTokenOutputDtoType,
} from "@workspace/validation/modules/user-token/dto/create-user-token.schema";

export class CreateUserTokenUseCase {
  constructor(
    private readonly userTokenService: UserTokenService,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(input: CreateUserTokenInputDtoType, userId: string): Promise<CreateUserTokenOutputDtoType> {
    const memberships = await this.membershipPort.findManyByUser(userId);
    const primaryRole = this.resolvePrimaryRole(memberships);

    const { scopes, scopePreset } = this.resolveScopes(input, primaryRole);
    const projectIds = await this.resolveProjectIds(input.projectIds ?? null, userId, memberships);

    const secret = this.userTokenService.createSecret();
    const userToken = UserTokenFactory.create({
      userId,
      name: input.name,
      tokenHash: this.userTokenService.hashSecret(secret),
      prefix: this.userTokenService.displayPrefix(secret),
      scopes,
      scopePreset,
      projectIds,
    });

    await this.userTokenRepository.save(userToken);
    return UserTokenMapper.toCreatedDto(userToken, secret);
  }

  private resolvePrimaryRole(memberships: { role: UserRole }[]): UserRole | undefined {
    if (memberships.some((membership) => membership.role === UserRole.ADMIN)) {
      return UserRole.ADMIN;
    }
    return memberships[0]?.role;
  }

  private resolveScopes(
    input: CreateUserTokenInputDtoType,
    userRole?: UserRole,
  ): { scopes: McpToolScopeType[]; scopePreset: UserTokenScopePresetType } {
    const preset = input.preset ?? "readOnly";
    const requested =
      preset === "custom"
        ? [...new Set(input.scopes ?? [])]
        : [...new Set(presetScopes(preset as Exclude<UserTokenScopePresetType, "custom">))];

    if (requested.length === 0) {
      throw new BadRequestError(ERROR_CODES.USER_TOKEN_NOT_FOUND, "Choose at least one permission");
    }

    if (preset === "custom" && requested.includes("activity:read") && userRole !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Activity access requires an administrator");
    }

    const scopes = expandMcpScopes(requested).filter(
      (scope) => userRole === UserRole.ADMIN || scope !== "activity:read",
    );

    return { scopes, scopePreset: preset };
  }

  private async resolveProjectIds(
    projectIds: string[] | null,
    userId: string,
    memberships: Awaited<ReturnType<MembershipPort["findManyByUser"]>>,
  ): Promise<string[] | null> {
    if (!projectIds) return null;
    if (projectIds.length === 0) {
      throw new BadRequestError(ERROR_CODES.PROJECT_NOT_FOUND, "Select at least one project");
    }

    const allowedProjectIds = new Set<string>();
    for (const membership of memberships) {
      const organizationProjects = await this.projectPort.findManyByOrganizationId({
        organizationId: membership.organizationId,
      });
      const filtered = await this.membershipPort.filterProjectIds(
        membership,
        organizationProjects.map((project) => project.id),
      );
      for (const projectId of filtered) {
        allowedProjectIds.add(projectId);
      }
    }

    const uniqueRequested = [...new Set(projectIds)];
    if (uniqueRequested.some((projectId) => !allowedProjectIds.has(projectId))) {
      throw new ForbiddenError(
        ERROR_CODES.CANNOT_RESTRICT_ADMIN,
        "You can only limit tokens to projects you can access",
      );
    }

    return uniqueRequested;
  }
}
