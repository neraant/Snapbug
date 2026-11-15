import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { format, formatDistance, isToday, isYesterday } from "date-fns";

import { texts } from "@/client/modules/activity-log/consts/texts.const";

const activityExactFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZoneName: "short",
});

export function formatActivityRelativeWhen(occurredAt: string): string {
  return formatDistance(new Date(occurredAt), new Date(), { addSuffix: true });
}

export function formatActivityExactWhen(occurredAt: string): string {
  return activityExactFormat.format(new Date(occurredAt));
}

export function formatActivityDayLabel(occurredAt: string): string {
  const date = new Date(occurredAt);
  if (isToday(date)) return texts.day.today;
  if (isYesterday(date)) return texts.day.yesterday;
  return format(date, "d MMM yyyy");
}

export function formatActivityObjectBadge(entityType: string): string {
  if (entityType in texts.entityBadge) {
    return texts.entityBadge[entityType as keyof typeof texts.entityBadge];
  }
  return formatActivityObjectType(entityType);
}

export function formatActivityObjectType(entityType: string): string {
  if (entityType in texts.entity) {
    return texts.entity[entityType as keyof typeof texts.entity];
  }
  return entityType;
}

export function formatActivityActorName(entry: ActivityLogType): string {
  if (entry.actorName) return entry.actorName;
  if (entry.actorId) return entry.actorLabel;
  return texts.actor.system;
}

export function formatActivityEventSentence(entry: ActivityLogType): {
  lead: string;
  object: string;
  tail?: string;
} {
  const statusChange = entry.changes.find((change) => change.field === "status");
  if (statusChange?.to) {
    return {
      lead: texts.event.changedStatusOf,
      object: entry.entityLabel,
      tail: statusChange.to,
    };
  }

  return { lead: entry.action, object: entry.entityLabel };
}

export function formatActivityChange(change: ActivityLogType["changes"][number]): string {
  const empty = texts.change.empty;
  const from = change.from ?? empty;
  const to = change.to ?? empty;
  return `${change.field}: ${from} → ${to}`;
}