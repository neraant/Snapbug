import type { McpToolListingService } from "@workspace/server/shared/orpc/mcp/mcp-tool-listing.service";
import type { ListMcpToolsOutputDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class ListToolsUseCase {
  constructor(private readonly mcpToolListingService: McpToolListingService) {}

  async execute(role: UserRole | undefined): Promise<ListMcpToolsOutputDtoType> {
    const { router } = await import("@workspace/server/shared/router.const");
    return this.mcpToolListingService.listForRole(role, router);
  }
}
