import { ListToolsUseCase } from "@workspace/server/modules/mcp/application/list-tools.use-case";
import { McpToolListingService } from "@workspace/server/shared/orpc/mcp/mcp-tool-listing.service";
import { router } from "@workspace/server/shared/router.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";

describe("ListToolsUseCase", () => {
  it("marks admin-only tools as unavailable for members", () => {
    const result = new McpToolListingService().listForRole(UserRole.USER, router);
    const listActivity = result.tools.find((tool) => tool.name === "list_activity");

    expect(listActivity?.unavailable).toBe(true);
    expect(result.tools.find((tool) => tool.name === "list_tickets")?.unavailable).toBe(false);
  });

  it("returns every catalog tool with a summary", async () => {
    const useCase = new ListToolsUseCase(new McpToolListingService());

    const result = await useCase.execute(UserRole.ADMIN);

    expect(result.summary.total).toBe(result.tools.length);
    expect(result.summary.read + result.summary.write).toBe(result.summary.total);
    expect(result.tools.every((tool) => tool.examplePrompt.length > 0)).toBe(true);
  });
});
