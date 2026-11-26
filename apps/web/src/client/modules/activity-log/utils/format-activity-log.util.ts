import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { format, isToday, isYesterday } from "date-fns";

import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";
import { dateFnsLocale } from "@/client/modules/shared/locale/date-fns-locale.util";

export function formatActivityWhen(occurredAt: string, timeZone: string): string {
  return formatUserDate({ createdAt: occurredAt, timeZone, relative: true });
}

export function formatActivityRelativeWhen(occurredAt: string, timeZone: string): string {
  return formatUserDate({ createdAt: occurredAt, timeZone, relative: true });
}

export function formatActivityExactWhen(occurredAt: string, timeZone: string): string {
  return formatUserDate({ createdAt: occurredAt, timeZone });
}

export function formatActivityDayLabel(occurredAt: string): string {
  const date = new Date(occurredAt);
  if (isToday(date)) return texts.day.today;
  if (isYesterday(date)) return texts.day.yesterday;
  return format(date, "d MMM yyyy", { locale: dateFnsLocale() });
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

const sentenceByAction = {
  "Create bug report": "createdTicket",
  "Update bug report": "updatedTicket",
  "Add comment": "addedComment",
  "Update comment": "updatedComment",
  "Delete comment": "deletedComment",
  "Create project": "createdProject",
  "Update project": "updatedProject",
  "Delete project": "deletedProject",
  "Archive project": "archivedProject",
  "Restore project": "restoredProject",
  "Update project widget settings": "updatedProjectWidget",
  "Create membership": "createdMember",
  "Update membership role": "updatedMember",
  "Grant project access": "grantedProjectAccess",
  "Send invitation": "sentInvitation",
  "Resend invitation": "resentInvitation",
  "Revoke invitation": "revokedInvitation",
  "Accept invitation": "acceptedInvitation",
  "Create organization": "createdOrganization",
  "Update organization": "updatedOrganization",
  "Create API key": "createdApiKey",
  "Rotate API key": "rotatedApiKey",
  "Revoke API key": "revokedApiKey",
} as const;

function activityObjectLabel(entry: ActivityLogType): string {
  if (entry.entityType === "bug-report" && entry.entityShortId) {
    return entry.entityShortId;
  }

  if (entry.entityType === "comment") {
    return texts.event.commentObject;
  }

  return entry.entityLabel;
}

function activityStatusLabel(value: string): string {
  if (value in texts.status) {
    return texts.status[value as keyof typeof texts.status];
  }

  return value;
}

export function formatActivityEventSentence(entry: ActivityLogType): {
  lead: string;
  object: string;
  tail?: string;
} {
  const object = activityObjectLabel(entry);
  const statusChange = entry.changes.find((change) => change.field === "status");
  if (statusChange?.to) {
    return {
      lead: texts.event.changedStatusOf,
      object,
      tail: activityStatusLabel(statusChange.to),
    };
  }

  const sentenceKey = sentenceByAction[entry.action as keyof typeof sentenceByAction];
  if (sentenceKey) {
    return { lead: texts.event[sentenceKey], object };
  }

  return { lead: entry.action, object };
}

export function formatActivityChange(change: ActivityLogType["changes"][number]): string {
  const empty = texts.change.empty;
  const from = change.from ?? empty;
  const to = change.to ?? empty;
  return `${change.field}: ${from} → ${to}`;
}
