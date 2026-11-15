import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

export function getActivityActorInitials(entry: ActivityLogType): string {
  const source = entry.actorName?.trim() || entry.actorLabel.trim();
  const [first] = source;
  return (first ?? "?").toUpperCase();
}