"use client";

import { useQuery } from "@tanstack/react-query";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@workspace/design-system/components/ui/sheet";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CopyIcon } from "lucide-react";
import Link from "next/link";

import { ActivityLogPropertyRow } from "@/client/modules/activity-log/components/activity-log-property-row";
import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { getActivityActorInitials } from "@/client/modules/activity-log/utils/activity-log-actor.util";
import { resolveActivityObjectHref } from "@/client/modules/activity-log/utils/activity-log-object-link.util";
import {
  formatActivityActorName,
  formatActivityEventSentence,
  formatActivityExactWhen,
  formatActivityObjectBadge,
  formatActivityRelativeWhen,
} from "@/client/modules/activity-log/utils/format-activity-log.util";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type ActivityLogDetailSheetProps = {
  entry: ActivityLogType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canMovePrevious: boolean;
  canMoveNext: boolean;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
};

export function ActivityLogDetailSheet({
  entry,
  open,
  onOpenChange,
  canMovePrevious,
  canMoveNext,
  onPrevious,
  onNext,
}: ActivityLogDetailSheetProps) {
  const { copied, copy } = useCopyText();
  const { data: projects = [] } = useQuery(orpcQuery.project.findProjects.queryOptions());
  const { data: preference } = useFindUserPreference();

  if (!entry) return null;

  const timeZone = preference.timeZone;

  const sentence = formatActivityEventSentence(entry);
  const objectHref = resolveActivityObjectHref(
    entry,
    projects.map((project) => ({ id: project.id, slug: project.slug })),
  );
  const actorName = formatActivityActorName(entry);
  const hasStructuredChanges = entry.changes.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton>
        <SheetHeader>
          <Row align="start" justify="between" gap="sm" width="full">
            <Column gap="sm" minWidth="0" className="min-w-0 pr-8">
              <Badge variant="outline" className="w-fit">
                {formatActivityObjectBadge(entry.entityType)}
              </Badge>
              <SheetTitle className="text-left">
                {sentence.lead}{" "}
                <Typography as="span" weight="medium">
                  {sentence.object}
                </Typography>
                {sentence.tail ? (
                  <>
                    {" "}
                    {texts.event.to} {sentence.tail}
                  </>
                ) : null}
              </SheetTitle>
            </Column>
            <Row align="center" gap="xs" wrap={false} className="absolute top-4 right-12">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={texts.detail.previous}
                disabled={!canMovePrevious}
                onClick={onPrevious}
              >
                <ChevronUpIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={texts.detail.next}
                disabled={!canMoveNext}
                onClick={onNext}
              >
                <ChevronDownIcon />
              </Button>
            </Row>
          </Row>
        </SheetHeader>
        <SheetBody>
          <Column gap="lg" width="full">
            <Column gap="sm" width="full">
              <Typography variant="heading-xs" weight="semibold">
                {texts.detail.summary}
              </Typography>
              <ActivityLogPropertyRow
                label={texts.detail.actor}
                value={
                  <Row align="center" gap="xs" minWidth="0">
                    <Avatar size="xs">
                      <AvatarFallback>{getActivityActorInitials(entry)}</AvatarFallback>
                    </Avatar>
                    <Column gap="none" minWidth="0" align="end">
                      <Typography variant="text-xs" truncate>
                        {actorName}
                      </Typography>
                      {entry.actorId ? (
                        <Typography variant="text-xs" color="muted" truncate>
                          {entry.actorLabel}
                        </Typography>
                      ) : null}
                    </Column>
                  </Row>
                }
              />
              <ActivityLogPropertyRow
                label={texts.detail.when}
                value={`${formatActivityExactWhen(entry.occurredAt, timeZone)} (${formatActivityRelativeWhen(entry.occurredAt, timeZone)})`}
              />
              <ActivityLogPropertyRow
                label={texts.detail.object}
                value={
                  objectHref ? (
                    <Link href={objectHref} className="text-xs underline-offset-4 hover:underline">
                      {entry.entityLabel}
                    </Link>
                  ) : (
                    entry.entityLabel
                  )
                }
              />
              <ActivityLogPropertyRow label={texts.detail.action} value={entry.action} />
              <ActivityLogPropertyRow
                label={texts.detail.eventId}
                value={
                  <Row align="center" gap="xs" wrap={false}>
                    <Typography variant="text-xs" font="mono" truncate>
                      {entry.id}
                    </Typography>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={texts.detail.copyEventId}
                      onClick={() => {
                        copy(entry.id).catch(() => undefined);
                      }}
                    >
                      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
                    </Button>
                  </Row>
                }
              />
            </Column>

            <Separator />

            <Column gap="sm" width="full">
              <Typography variant="heading-xs" weight="semibold">
                {texts.detail.changes}
              </Typography>
              {hasStructuredChanges ? (
                <Table.Shell>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>{texts.change.field}</Table.Head>
                        <Table.Head>{texts.change.before}</Table.Head>
                        <Table.Head>{texts.change.after}</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {entry.changes.map((change) => (
                        <Table.Row key={change.field}>
                          <Table.Cell>
                            <Typography variant="text-xs">{change.field}</Typography>
                          </Table.Cell>
                          <Table.Cell className="max-w-40 whitespace-normal">
                            <Typography variant="text-xs" color="muted" className="line-through">
                              {change.from ?? texts.change.empty}
                            </Typography>
                          </Table.Cell>
                          <Table.Cell className="max-w-40 whitespace-normal">
                            <Typography variant="text-xs" weight="medium">
                              {change.to ?? texts.change.empty}
                            </Typography>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Table.Shell>
              ) : (
                <Code code={JSON.stringify(entry.changes, null, 2)} showCopy={false} />
              )}
            </Column>
          </Column>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
