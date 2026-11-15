import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import { UpdateProjectUseCase } from "@workspace/server/modules/project/application/update-project.use-case";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectAccessPort } from "@workspace/server/modules/project/port/project-access.port";
import type { ProjectUserPort } from "@workspace/server/modules/project/port/user.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingProject = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: persistedAt,
  ...projectTestFields,
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: "admin" as const,
  createdAt: persistedAt.toISOString(),
};

function createUseCase(deps: {
  membershipPort: MembershipPort;
  projectRepository: ProjectRepository;
  projectService: ProjectService;
  projectAccessPort: ProjectAccessPort;
  projectUserPort: ProjectUserPort;
  withTransaction: WithTransactionType;
}) {
  return new UpdateProjectUseCase(
    deps.membershipPort,
    deps.projectRepository,
    deps.projectService,
    deps.projectAccessPort,
    deps.projectUserPort,
    deps.withTransaction,
  );
}

describe("UpdateProjectUseCase", () => {
  it("updates the project name and returns a public dto", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
      isSlugTakenInOrganization: vi.fn().mockResolvedValue(false),
      findSlugsByOrganizationId: vi.fn().mockResolvedValue(["acme-store"]),
    };
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const projectService = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = createUseCase({
      membershipPort: membershipPort as unknown as MembershipPort,
      projectRepository: projectRepository as unknown as ProjectRepository,
      projectService: projectService as unknown as ProjectService,
      projectAccessPort: { userHasProjectAccess: vi.fn() },
      projectUserPort: { findById: vi.fn() },
      withTransaction: withTransaction as WithTransactionType,
    });

    const result = await useCase.execute({ projectId, name: "Acme Checkout" }, userId);

    expect(saveWithAudit).toHaveBeenCalledOnce();
    expect(result).toEqual(ProjectMapper.toDto(saveWithAudit.mock.calls[0]?.[0]));
  });

  it("throws when the project is missing", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn(),
    };
    const projectRepository = { findById: vi.fn().mockResolvedValue(null) };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      membershipPort: membershipPort as unknown as MembershipPort,
      projectRepository: projectRepository as unknown as ProjectRepository,
      projectService: projectService as unknown as ProjectService,
      projectAccessPort: { userHasProjectAccess: vi.fn() },
      projectUserPort: { findById: vi.fn() },
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
    };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      membershipPort: membershipPort as unknown as MembershipPort,
      projectRepository: projectRepository as unknown as ProjectRepository,
      projectService: projectService as unknown as ProjectService,
      projectAccessPort: { userHasProjectAccess: vi.fn() },
      projectUserPort: { findById: vi.fn() },
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute({ projectId, name: "Acme Checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("throws when the slug is already taken in the organization", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
      isSlugTakenInOrganization: vi.fn().mockResolvedValue(true),
    };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      membershipPort: membershipPort as unknown as MembershipPort,
      projectRepository: projectRepository as unknown as ProjectRepository,
      projectService: projectService as unknown as ProjectService,
      projectAccessPort: { userHasProjectAccess: vi.fn() },
      projectUserPort: { findById: vi.fn() },
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute({ projectId, slug: "checkout" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_SLUG_TAKEN,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("throws when the default assignee does not have project access", async () => {
    const defaultAssigneeId = "8a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectRepository = {
      findById: vi.fn().mockResolvedValue(existingProject),
      isSlugTakenInOrganization: vi.fn(),
    };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = createUseCase({
      membershipPort: membershipPort as unknown as MembershipPort,
      projectRepository: projectRepository as unknown as ProjectRepository,
      projectService: projectService as unknown as ProjectService,
      projectAccessPort: {
        userHasProjectAccess: vi.fn().mockResolvedValue(false),
      },
      projectUserPort: { findById: vi.fn().mockResolvedValue({ id: defaultAssigneeId }) },
      withTransaction: withTransaction as WithTransactionType,
    });

    await expect(useCase.execute({ projectId, defaultAssigneeId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_DEFAULT_ASSIGNEE,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });
});
