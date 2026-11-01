import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const input = {
  organizationId,
  name: "Acme Store",
  color: "#F97316" as const,
};

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: "2026-10-03T09:00:00.000Z",
};

describe("CreateProjectUseCase", () => {
  it("creates a project and returns a public dto", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      grantProjectToMembers: vi.fn(),
      withTx: vi.fn(),
    };
    membershipPort.withTx.mockReturnValue(membershipPort);
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const projectService = {
      withTx: vi.fn().mockReturnValue({
        withActor: vi.fn().mockReturnValue({ saveWithAudit }),
      }),
    };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new CreateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute(input, userId);

    expect(saveWithAudit).toHaveBeenCalledOnce();
    expect(membershipPort.grantProjectToMembers).toHaveBeenCalledWith(organizationId, result.id, userId);
    expect(result).toEqual(ProjectMapper.toDto(saveWithAudit.mock.calls[0]?.[0]));
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new CreateProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectService as unknown as ProjectService,
      withTransaction as WithTransactionType,
    );

    await expect(useCase.execute(input, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });
});
