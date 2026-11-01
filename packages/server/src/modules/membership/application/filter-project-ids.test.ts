import { FilterProjectIdsUseCase } from "@workspace/server/modules/membership/application/filter-project-ids.use-case";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const membershipId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const allowedProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const hiddenProjectId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

describe("FilterProjectIdsUseCase", () => {
  it("returns every project for an admin", async () => {
    const projectAccessRepository = { findManyByMembershipId: vi.fn() };
    const useCase = new FilterProjectIdsUseCase(projectAccessRepository as unknown as ProjectAccessRepository);

    const result = await useCase.execute({ id: membershipId, role: UserRole.ADMIN }, [
      allowedProjectId,
      hiddenProjectId,
    ]);

    expect(result).toEqual([allowedProjectId, hiddenProjectId]);
    expect(projectAccessRepository.findManyByMembershipId).not.toHaveBeenCalled();
  });

  it("returns the member allow-list", async () => {
    const projectAccessRepository = {
      findManyByMembershipId: vi.fn().mockResolvedValue([
        new ProjectAccess({
          id: "6a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
          membershipId,
          projectId: allowedProjectId,
          createdAt: new Date(),
        }),
      ]),
    };
    const useCase = new FilterProjectIdsUseCase(projectAccessRepository as unknown as ProjectAccessRepository);

    const result = await useCase.execute({ id: membershipId, role: UserRole.USER }, [
      allowedProjectId,
      hiddenProjectId,
    ]);

    expect(projectAccessRepository.findManyByMembershipId).toHaveBeenCalledWith(membershipId);
    expect(result).toEqual([allowedProjectId]);
  });
});
