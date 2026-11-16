import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import type { OrpcMetaType } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { findActivityLogsOutputDtoSchema } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { findActivityLogsInputDtoSchema } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";

const audit = oc.$meta<OrpcMetaType>({});

export const auditContract = {
  findActivityLogs: oc
    .input(findActivityLogsInputDtoSchema.partial().optional())
    .output(findActivityLogsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/activity-logs",
      tags: ["audit"],
      summary: "List activity for the current organization",
      spec: sessionAuthSpec,
    }),
  listActivity: audit
    .meta({ mcp: true, name: "list_activity", readOnlyHint: true })
    .input(findActivityLogsInputDtoSchema.optional())
    .output(findActivityLogsOutputDtoSchema)
    .route({
      method: "GET",
      path: "/mcp/activity",
      tags: ["audit"],
      summary: "List activity for MCP",
      spec: sessionAuthSpec,
    }),
};
