import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { findActivityLogsInputDtoSchema } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import { findActivityLogsOutputDtoSchema } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

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
};
