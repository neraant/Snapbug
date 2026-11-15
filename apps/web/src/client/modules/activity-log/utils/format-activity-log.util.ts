import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

import { texts } from "@/client/modules/activity-log/consts/texts.const";

const activityWhenFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatActivityWhen(occurredAt: string): string {
  return activityWhenFormat.format(new Date(occurredAt));
}

export function formatActivityObject(entityType: string): string {
  if (entityType in texts.entity) {
    return texts.entity[entityType as keyof typeof texts.entity];
  }

  return entityType;
}

function formatActivityValue(value: string | null): string {
  return value ?? texts.change.empty;
}

export function formatActivityChange(change: ActivityLogType["changes"][number]): string {
  return `${change.field}: ${formatActivityValue(change.from)} → ${formatActivityValue(change.to)}`;
}
