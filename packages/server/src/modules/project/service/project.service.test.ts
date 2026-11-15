import { projectTestFields } from "@workspace/server/modules/project/application/project-test.const";
import { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectService } from "@workspace/server/modules/project/service/project.service";
import { describe, expect, it, vi } from "vitest";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const project = new Project({
  id: projectId,
  name: "Acme Store",
  color: "#F97316",
  organizationId,
  widgetSettings: null,
  createdAt: persistedAt,
  ...projectTestFields,
});

describe("ProjectService", () => {
  it("deletes the project before recording delete audit without project scope", async () => {
    const calls: string[] = [];
    const projectRepository = {
      delete: vi.fn(async () => {
        calls.push("delete");
      }),
    };
    const auditLogService = {
      save: vi.fn(async () => {
        calls.push("audit");
      }),
    };
    const service = new ProjectService(projectRepository as never, auditLogService as never, {
      type: "user",
      id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
    });

    await service.deleteWithAudit(project, "Delete project");

    expect(calls).toEqual(["delete", "audit"]);
    expect(auditLogService.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "Delete project",
        projectId: null,
        organizationId,
        entityId: projectId,
      }),
    );
  });
});
