import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export function narrowProjectIds(projectIds: string[], mcpProjectIds: string[] | null | undefined): string[] {
  if (!mcpProjectIds || mcpProjectIds.length === 0) return projectIds;
  const allowed = new Set(mcpProjectIds);
  return projectIds.filter((projectId) => allowed.has(projectId));
}

export function isMcpProjectAllowed(projectId: string, mcpProjectIds: string[] | null | undefined): boolean {
  if (!mcpProjectIds || mcpProjectIds.length === 0) return true;
  return mcpProjectIds.includes(projectId);
}

export function assertMcpProjectAllowed(
  projectId: string,
  mcpProjectIds: string[] | null | undefined,
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES] = ERROR_CODES.BUG_REPORT_NOT_FOUND,
): void {
  if (!isMcpProjectAllowed(projectId, mcpProjectIds)) {
    throw new NotFoundError(errorCode);
  }
}