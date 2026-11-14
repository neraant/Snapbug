import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { findActivityLogsOutputDtoSchema } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

export const auditContract = {
  findActivityLogs: oc.output(findActivityLogsOutputDtoSchema).route({
    method: "GET",
    path: "/activity-logs",
    tags: ["audit"],
    summary: "List activity for the current organization",
    spec: sessionAuthSpec,
  }),
};
