import { FindActivityLogsUseCase } from "@workspace/server/modules/audit/application/find-activity-logs.use-case";
import type { MembershipPort } from "@workspace/server/modules/audit/port/membership.port";
import type { UserPort } from "@workspace/server/modules/audit/port/user.port";
import { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const occurredAt = new Date("2026-11-13T12:00:00.000Z");

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: occurredAt.toISOString(),
};

const auditLog = new AuditLog({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  action: "Update organization",
  actorType: "user",
  actorId: userId,
  entityType: "organization",
  entityId: organizationId,
  organizationId,
  projectId: null,
  source: "web",
  occurredAt,
  changes: { name: { from: "Acme", to: "Acme Studio" } },
});

describe("FindActivityLogsUseCase", () => {
  it("returns who, when, which object, and what changed for an administrator", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([{ id: userId, email: "admin@example.com", name: "Admin" }]),
    };
    const auditLogRepository = { findManyByOrganizationId: vi.fn().mockResolvedValue([auditLog]) };
    const useCase = new FindActivityLogsUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      auditLogRepository as unknown as AuditLogRepository,
    );

    const result = await useCase.execute(userId, organizationId);

    expect(auditLogRepository.findManyByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual([
      {
        id: auditLog.id,
        occurredAt: occurredAt.toISOString(),
        actorLabel: "admin@example.com",
        entityType: "organization",
        entityId: organizationId,
        action: "Update organization",
        source: "web",
        changes: [{ field: "name", from: "Acme", to: "Acme Studio" }],
      },
    ]);
  });

  it("names the member who changed an object through MCP", async () => {
    const mcpLog = new AuditLog({
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      action: "Update ticket",
      actorType: "mcp",
      actorId: userId,
      entityType: "bug-report",
      entityId: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      organizationId,
      projectId: "6a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      source: "mcp",
      occurredAt,
      changes: { status: { from: "new", to: "resolved" } },
    });
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([{ id: userId, email: "admin@example.com", name: "Admin" }]),
    };
    const auditLogRepository = { findManyByOrganizationId: vi.fn().mockResolvedValue([mcpLog]) };
    const useCase = new FindActivityLogsUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      auditLogRepository as unknown as AuditLogRepository,
    );

    const result = await useCase.execute(userId, organizationId);

    expect(userPort.findManyByIds).toHaveBeenCalledWith([userId]);
    expect(result[0]).toMatchObject({
      actorLabel: "admin@example.com",
      entityType: "bug-report",
      entityId: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      source: "mcp",
    });
  });

  it("rejects a member without reading the log", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ ...membership, role: UserRole.USER }),
    };
    const userPort = { findManyByIds: vi.fn() };
    const auditLogRepository = { findManyByOrganizationId: vi.fn() };
    const useCase = new FindActivityLogsUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      auditLogRepository as unknown as AuditLogRepository,
    );

    await expect(useCase.execute(userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });

    expect(auditLogRepository.findManyByOrganizationId).not.toHaveBeenCalled();
  });
});
