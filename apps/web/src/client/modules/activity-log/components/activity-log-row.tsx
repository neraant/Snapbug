"use client";

import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Table } from "@workspace/design-system/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { ChevronRightIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { getActivityActorInitials } from "@/client/modules/activity-log/utils/activity-log-actor.util";
import {
  formatActivityActorName,
  formatActivityEventSentence,
  formatActivityExactWhen,
  formatActivityObjectBadge,
  formatActivityWhen,
} from "@/client/modules/activity-log/utils/format-activity-log.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type ActivityLogRowProps = {
  entry: ActivityLogType;
  selected: boolean;
  onOpen: VoidFunction;
};

export function ActivityLogRow({ entry, selected, onOpen }: ActivityLogRowProps) {
  const { data: preference } = useFindUserPreference();
  const sentence = formatActivityEventSentence(entry);
  const actorName = formatActivityActorName(entry);
  const isSystem = !entry.actorId;
  const timeZone = preference.timeZone;

  const onKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <Table.Row
      tabIndex={0}
      role="button"
      data-state={selected ? "selected" : undefined}
      className="group cursor-pointer"
      onClick={onOpen}
      onKeyDown={onKeyDown}
    >
      <Table.Cell className="w-28">
        <Tooltip>
          <TooltipTrigger
            render={
              <Typography variant="text-sm" color="muted" className="truncate">
                {formatActivityWhen(entry.occurredAt, timeZone)}
              </Typography>
            }
          />
          <TooltipContent>{formatActivityExactWhen(entry.occurredAt, timeZone)}</TooltipContent>
        </Tooltip>
      </Table.Cell>
      <Table.Cell className="w-44">
        <Row align="center" gap="sm" minWidth="0">
          <Avatar size="xs">
            <AvatarFallback>{getActivityActorInitials(entry)}</AvatarFallback>
          </Avatar>
          <Typography variant="text-sm" color={isSystem ? "muted" : undefined} truncate>
            {actorName}
          </Typography>
        </Row>
      </Table.Cell>
      <Table.Cell className="min-w-0 whitespace-normal">
        <Row align="center" gap="xs" minWidth="0" className="min-w-0">
          <Typography variant="text-sm" truncate className="min-w-0">
            {sentence.lead} <span className="font-medium">{sentence.object}</span>
            {sentence.tail ? (
              <>
                {" "}
                {texts.event.to} <span className="font-medium">{sentence.tail}</span>
              </>
            ) : null}
          </Typography>
          <ChevronRightIcon
            aria-hidden
            className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          />
        </Row>
      </Table.Cell>
      <Table.Cell className="w-32">
        <Badge variant="outline">{formatActivityObjectBadge(entry.entityType)}</Badge>
      </Table.Cell>
    </Table.Row>
  );
}
