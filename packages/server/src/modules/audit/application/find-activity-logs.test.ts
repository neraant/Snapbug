import { FindActivityLogsUseCase } from "@workspace/server/modules/audit/application/find-activity-logs.use-case";
import type { BugReportPort } from "@workspace/server/modules/audit/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/audit/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/audit/port/project.port";
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

function createUseCase(
  overrides: {
    membershipPort?: Partial<MembershipPort>;
    userPort?: Partial<UserPort>;
    projectPort?: Partial<ProjectPort>;
    bugReportPort?: Partial<BugReportPort>;
    auditLogRepository?: Partial<AuditLogRepository>;
  } = {},
) {
  const membershipPort = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    findManyByIds: vi.fn().mockResolvedValue([]),
    ...overrides.membershipPort,
  };
  const userPort = {
    findManyByIds: vi.fn().mockResolvedValue([{ id: userId, email: "admin@example.com", name: "Admin" }]),
    ...overrides.userPort,
  };
  const projectPort = {
    findManyByIds: vi.fn().mockResolvedValue([]),
    ...overrides.projectPort,
  };
  const bugReportPort = {
    findManyByIds: vi.fn().mockResolvedValue([]),
    ...overrides.bugReportPort,
  };
  const auditLogRepository = {
    findPageByOrganizationId: vi.fn().mockResolvedValue([auditLog]),
    ...overrides.auditLogRepository,
  };

  return new FindActivityLogsUseCase(
    membershipPort as unknown as MembershipPort,
    userPort as unknown as UserPort,
    projectPort as unknown as ProjectPort,
    bugReportPort as unknown as BugReportPort,
    auditLogRepository as unknown as AuditLogRepository,
  );
}

describe("FindActivityLogsUseCase", () => {
  it("returns who, when, which object, and what changed for an administrator", async () => {
    const useCase = createUseCase();

    const result = await useCase.execute(userId, organizationId, { limit: 50 });

    expect(result.items).toEqual([
      {
        id: auditLog.id,
        occurredAt: occurredAt.toISOString(),
        actorId: userId,
        actorName: "Admin",
        actorLabel: "admin@example.com",
        entityType: "organization",
        entityId: organizationId,
        entityLabel: "Acme Studio",
        entityExists: true,
        entityShortId: null,
        projectId: null,
        action: "Update organization",
        source: "web",
        changes: [{ field: "name", from: "Acme", to: "Acme Studio" }],
      },
    ]);
    expect(result.nextCursor).toBeNull();
  });

  it("marks a ticket as linkable when it still exists", async () => {
    const ticketId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
    const projectId = "6a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
    const mcpLog = new AuditLog({
      id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      action: "Update ticket",
      actorType: "mcp",
      actorId: userId,
      entityType: "bug-report",
      entityId: ticketId,
      organizationId,
      projectId,
      source: "mcp",
      occurredAt,
      changes: { status: { from: "new", to: "resolved" } },
    });
    const useCase = createUseCase({
      auditLogRepository: { findPageByOrganizationId: vi.fn().mockResolvedValue([mcpLog]) },
      bugReportPort: {
        findManyByIds: vi.fn().mockResolvedValue([{ id: ticketId, shortId: "SNB-11", projectId }]),
      },
    });

    const result = await useCase.execute(userId, organizationId, {});

    expect(result.items[0]).toMatchObject({
      entityType: "bug-report",
      entityExists: true,
      entityShortId: "SNB-11",
    });
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
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([{ id: userId, email: "admin@example.com", name: "Admin" }]),
    };
    const useCase = createUseCase({
      userPort,
      auditLogRepository: { findPageByOrganizationId: vi.fn().mockResolvedValue([mcpLog]) },
    });

    const result = await useCase.execute(userId, organizationId, {});

    expect(userPort.findManyByIds).toHaveBeenCalledWith([userId]);
    expect(result.items[0]).toMatchObject({
      actorLabel: "admin@example.com",
      entityType: "bug-report",
      entityId: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      entityExists: false,
      entityShortId: null,
      source: "mcp",
    });
  });

  it("requests twenty rows by default when limit is omitted", async () => {
    const auditLogRepository = { findPageByOrganizationId: vi.fn().mockResolvedValue([auditLog]) };
    const useCase = createUseCase({ auditLogRepository });

    await useCase.execute(userId, organizationId, {});

    expect(auditLogRepository.findPageByOrganizationId).toHaveBeenCalledWith(expect.objectContaining({ limit: 20 }));
  });

  it("returns a cursor when another page of activity exists", async () => {
    const olderLog = new AuditLog({
      ...auditLog.toObject(),
      id: "7a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      occurredAt: new Date("2026-11-12T12:00:00.000Z"),
    });
    const useCase = createUseCase({
      auditLogRepository: { findPageByOrganizationId: vi.fn().mockResolvedValue([auditLog, olderLog]) },
    });

    const result = await useCase.execute(userId, organizationId, { limit: 1 });

    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBe(`${occurredAt.toISOString()}|${auditLog.id}`);
  });

  it("narrows activity to selected projects for an MCP token subset", async () => {
    const projectId = "6a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
    const auditLogRepository = { findPageByOrganizationId: vi.fn().mockResolvedValue([]) };
    const useCase = createUseCase({ auditLogRepository });

    await useCase.execute(userId, organizationId, {}, [projectId]);

    expect(auditLogRepository.findPageByOrganizationId).toHaveBeenCalledWith(
      expect.objectContaining({ projectIds: [projectId] }),
    );
  });

  it("rejects a member without reading the log", async () => {
    const auditLogRepository = { findPageByOrganizationId: vi.fn() };
    const useCase = createUseCase({
      membershipPort: {
        findByUserAndOrganization: vi.fn().mockResolvedValue({ ...membership, role: UserRole.USER }),
      },
      userPort: { findManyByIds: vi.fn() },
      auditLogRepository,
    });

    await expect(useCase.execute(userId, organizationId, {})).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });

    expect(auditLogRepository.findPageByOrganizationId).not.toHaveBeenCalled();
  });
});
