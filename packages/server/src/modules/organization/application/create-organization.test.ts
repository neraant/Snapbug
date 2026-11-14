import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { OrganizationService } from "@workspace/server/modules/organization/service/organization.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const input = {
  name: "Acme",
};

const project = {
  id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  name: "Default project",
  organizationId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  createdAt: "2026-10-03T09:00:00.000Z",
};

const tx = { id: "tx" };
const withTransaction = vi.fn(async (callback: (transaction: unknown) => Promise<unknown>) => await callback(tx));

function organizationServiceWith(saveWithAudit: ReturnType<typeof vi.fn>) {
  const service = {
    withTx: vi.fn(),
    withActor: vi.fn().mockReturnValue({ saveWithAudit }),
  };
  service.withTx.mockReturnValue(service);
  return service;
}

describe("CreateOrganizationUseCase", () => {
  it("creates an organization, an admin membership, and a default project", async () => {
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const organizationService = organizationServiceWith(saveWithAudit);
    const membershipInTx = { create: vi.fn().mockResolvedValue(null) };
    const projectInTx = { create: vi.fn().mockResolvedValue(project) };
    const membershipPort = { withTx: vi.fn().mockReturnValue(membershipInTx) };
    const projectPort = { withTx: vi.fn().mockReturnValue(projectInTx) };
    const useCase = new CreateOrganizationUseCase(
      organizationService as unknown as OrganizationService,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransaction as unknown as WithTransactionType,
    );

    const result = await useCase.execute(input, userId);

    expect(organizationService.withTx).toHaveBeenCalledWith(tx);
    expect(saveWithAudit).toHaveBeenCalledOnce();
    const saved = saveWithAudit.mock.calls[0]?.[0];
    expect(saved.name).toBe(input.name);
    expect(saved.reports_retention_days).toBe(90);
    expect(membershipInTx.create).toHaveBeenCalledWith({ organizationId: saved.id }, userId);
    expect(projectInTx.create).toHaveBeenCalledWith(
      { organizationId: saved.id, name: "Default project", color: "#F97316" },
      userId,
    );
    expect(result).toEqual({
      organization: OrganizationMapper.toDto(saved),
      project,
    });
  });

  it("uses the given reports retention", async () => {
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const organizationService = organizationServiceWith(saveWithAudit);
    const membershipPort = { withTx: vi.fn().mockReturnValue({ create: vi.fn().mockResolvedValue(null) }) };
    const projectPort = { withTx: vi.fn().mockReturnValue({ create: vi.fn().mockResolvedValue(project) }) };
    const useCase = new CreateOrganizationUseCase(
      organizationService as unknown as OrganizationService,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ name: "Acme", reports_retention_days: 30 }, userId);

    const saved = saveWithAudit.mock.calls[0]?.[0];
    expect(saved.reports_retention_days).toBe(30);
  });

  it("creates another organization when the user already belongs to one", async () => {
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const organizationService = organizationServiceWith(saveWithAudit);
    const membershipInTx = { create: vi.fn().mockResolvedValue(null) };
    const projectInTx = { create: vi.fn().mockResolvedValue(project) };
    const membershipPort = { withTx: vi.fn().mockReturnValue(membershipInTx) };
    const projectPort = { withTx: vi.fn().mockReturnValue(projectInTx) };
    const useCase = new CreateOrganizationUseCase(
      organizationService as unknown as OrganizationService,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute(input, userId);

    expect(saveWithAudit).toHaveBeenCalledOnce();
    expect(membershipInTx.create).toHaveBeenCalledOnce();
    expect(projectInTx.create).toHaveBeenCalledOnce();
  });
});
