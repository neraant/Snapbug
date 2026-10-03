import type { OpenAPI } from "@orpc/contract";

export function sessionAuthSpec(operation: OpenAPI.OperationObject): OpenAPI.OperationObject {
  return {
    ...operation,
    description: operation.description
      ? `${operation.description}\n\nRequires a signed-in session.`
      : "Requires a signed-in session.",
    security: [{ cookieAuth: [] }],
  };
}
