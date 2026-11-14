import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

import { texts } from "@/client/modules/activity-log/consts/texts.const";

export function formatActivityWhen(occurredAt: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(occurredAt));
}

export function formatActivityObject(entityType: string): string {
  if (entityType in texts.entity) {
    return texts.entity[entityType as keyof typeof texts.entity];
  }

  return entityType;
}

export function formatActivityChange(change: ActivityLogType["changes"][number]): string {
  return `${change.field}: ${change.from ?? "empty"} → ${change.to ?? "empty"}`;
}
