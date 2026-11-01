import { CountOpenByProjectUseCase } from "@workspace/server/modules/bug-report/application/count-open-by-project.use-case";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

describe("CountOpenByProjectUseCase", () => {
  it("returns open report counts for organization projects", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([{ id: projectId }]),
    };
    const bugReportRepository = {
      countOpenByProject: vi.fn().mockResolvedValue([{ projectId, count: 4 }]),
    };
    const useCase = new CountOpenByProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute(userId, organizationId);

    expect(projectPort.findManyByOrganizationId).toHaveBeenCalledWith({ organizationId });
    expect(bugReportRepository.countOpenByProject).toHaveBeenCalledWith([projectId]);
    expect(result).toEqual([{ projectId, openCount: 4 }]);
  });

  it("rejects users without an organization before counting reports", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectPort = { findManyByOrganizationId: vi.fn() };
    const bugReportRepository = { countOpenByProject: vi.fn() };
    const useCase = new CountOpenByProjectUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute(userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(bugReportRepository.countOpenByProject).not.toHaveBeenCalled();
  });
});
