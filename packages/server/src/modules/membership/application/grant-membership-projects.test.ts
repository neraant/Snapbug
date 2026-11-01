import { GrantMembershipProjectsUseCase } from "@workspace/server/modules/membership/application/grant-membership-projects.use-case";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import { describe, expect, it, vi } from "vitest";

const membershipId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const userId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const firstProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const secondProjectId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

function setup(existing: ProjectAccess[] = []) {
  const projectAccessRepository = { findManyByMembershipId: vi.fn().mockResolvedValue(existing) };
  const saveWithAudit = vi.fn();
  const withActor = vi.fn().mockReturnValue({ saveWithAudit });
  const projectAccessService = { withActor };
  const useCase = new GrantMembershipProjectsUseCase(
    projectAccessRepository as unknown as ProjectAccessRepository,
    projectAccessService as unknown as ProjectAccessService,
  );

  return { projectAccessRepository, saveWithAudit, withActor, useCase };
}

describe("GrantMembershipProjectsUseCase", () => {
  it("grants every project to the membership", async () => {
    const { useCase, saveWithAudit, withActor } = setup();

    await useCase.execute(membershipId, [firstProjectId, secondProjectId, firstProjectId], userId);

    expect(withActor).toHaveBeenCalledWith({ type: "user", id: userId });
    const saved = saveWithAudit.mock.calls.map((call) => call[0] as ProjectAccess);
    expect(saved.map((projectAccess) => projectAccess.projectId)).toEqual([firstProjectId, secondProjectId]);
    expect(saved.every((projectAccess) => projectAccess.membershipId === membershipId)).toBe(true);
    expect(saveWithAudit).toHaveBeenCalledWith(expect.any(ProjectAccess), "Grant project access");
  });

  it("does not grant a project the membership already has", async () => {
    const existing = new ProjectAccess({
      id: "aa8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      membershipId,
      projectId: firstProjectId,
      createdAt: new Date("2026-10-03T09:00:00.000Z"),
    });
    const { useCase, saveWithAudit } = setup([existing]);

    await useCase.execute(membershipId, [firstProjectId, secondProjectId], userId);

    const saved = saveWithAudit.mock.calls.map((call) => call[0] as ProjectAccess);
    expect(saved.map((projectAccess) => projectAccess.projectId)).toEqual([secondProjectId]);
  });

  it("does not write when there are no projects", async () => {
    const { useCase, saveWithAudit, projectAccessRepository } = setup();

    await useCase.execute(membershipId, [], userId);

    expect(projectAccessRepository.findManyByMembershipId).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });
});
