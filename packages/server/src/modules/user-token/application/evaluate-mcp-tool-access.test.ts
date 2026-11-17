import { EvaluateMcpToolAccessUseCase } from "@workspace/server/modules/user-token/application/evaluate-mcp-tool-access.use-case";
import { LEGACY_USER_TOKEN_SCOPES, MCP_READ_SCOPES } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";

describe("EvaluateMcpToolAccessUseCase", () => {
  const useCase = new EvaluateMcpToolAccessUseCase();

  it("allows read tools when tickets:read is granted", () => {
    const result = useCase.execute({
      toolName: "list_tickets",
      tokenScopes: ["tickets:read"],
      userRole: UserRole.USER,
    });

    expect(result).toEqual({ allowed: true });
  });

  it("denies write tools without the matching scope", () => {
    const result = useCase.execute({
      toolName: "update_ticket",
      tokenScopes: MCP_READ_SCOPES,
      userRole: UserRole.USER,
    });

    expect(result).toEqual({ allowed: false, missingScope: "tickets:write", reason: "scope" });
  });

  it("treats write scopes as implying read access", () => {
    const result = useCase.execute({
      toolName: "get_ticket",
      tokenScopes: ["tickets:write"],
      userRole: UserRole.USER,
    });

    expect(result).toEqual({ allowed: true });
  });

  it("denies admin-only tools for members even with activity scope", () => {
    const result = useCase.execute({
      toolName: "list_activity",
      tokenScopes: ["activity:read"],
      userRole: UserRole.USER,
    });

    expect(result).toEqual({ allowed: false, missingScope: "activity:read", reason: "role" });
  });

  it("lists only tools covered by the token scopes", () => {
    const names = useCase.listVisibleToolNames(LEGACY_USER_TOKEN_SCOPES, UserRole.USER).sort();

    expect(names).toContain("update_ticket");
    expect(names).toContain("add_comment");
    expect(names).not.toContain("list_activity");
    expect(names).not.toContain("list_projects");
  });

  it("keeps legacy migration scopes on ticket and comment tools", () => {
    const names = new Set(useCase.listVisibleToolNames(LEGACY_USER_TOKEN_SCOPES, UserRole.USER));

    expect(names.has("list_tickets")).toBe(true);
    expect(names.has("update_ticket")).toBe(true);
    expect(names.has("list_comments")).toBe(true);
    expect(names.has("add_comment")).toBe(true);
  });
});