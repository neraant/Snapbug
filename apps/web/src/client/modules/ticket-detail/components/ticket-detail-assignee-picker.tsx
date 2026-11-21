import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Input } from "@workspace/design-system/components/ui/input";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { CheckIcon, ChevronDownIcon, UserRoundIcon } from "lucide-react";
import { type ReactNode, Suspense } from "react";

import { getProjectMemberInitials } from "@/client/modules/project/utils/get-project-member-initials.util";
import { TicketDetailPropertyRow } from "@/client/modules/ticket-detail/components/ticket-detail-property-row";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailAssignee } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-assignee";

type TicketDetailAssigneePickerProps = {
  shortId: string;
};

const unassignedOptionKey = "__unassigned__";

function TicketDetailAssigneePickerContent({ shortId }: TicketDetailAssigneePickerProps) {
  const {
    ticket,
    filteredMembers,
    currentMember,
    onOpenChange,
    query,
    setQuery,
    assign,
    isPending,
    inlineError,
    currentUser,
    members,
  } = useTicketDetailAssignee({ shortId });

  const assigneeName = ticket.assignee?.name?.trim() || texts.sidebar.unassigned;
  const assigneeEmail = ticket.assignee?.email;
  const showAssignToMe =
    currentMember != null &&
    (ticket.assignedTo == null || ticket.assignedTo !== currentUser.id) &&
    filteredMembers.some((member) => member.userId === currentUser.id);

  const options = [
    ...(showAssignToMe
      ? [{ kind: "assignToMe" as const, key: "assign-to-me", userId: currentUser.id, member: currentMember }]
      : []),
    { kind: "unassigned" as const, key: unassignedOptionKey },
    ...filteredMembers.map((member) => ({
      kind: "member" as const,
      key: member.userId,
      userId: member.userId,
      member,
    })),
  ];

  const onSelect = (userId: string | null, member?: (typeof members)[number] | null) => {
    assign(userId, member).catch(() => undefined);
  };

  return (
    <TicketDetailPropertyRow
      label={texts.sidebar.assignee}
      value={
        <Column gap="xs" align="end" width="full" minWidth="0" className="min-w-0">
          <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger
              disabled={isPending}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={texts.assignee.triggerAriaLabel}
                  className="h-auto max-w-full min-w-0 justify-end gap-2 px-2 py-1"
                />
              }
            >
              <Row align="center" gap="sm" wrap={false} minWidth="0" className="min-w-0">
                <Avatar size="sm" className="shrink-0">
                  <AvatarFallback>
                    {ticket.assignee
                      ? getProjectMemberInitials(ticket.assignee.name, ticket.assignee.email)
                      : texts.sidebar.unassigned.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <Column gap="none" align="start" minWidth="0" className="min-w-0 text-left">
                  <Typography variant="text-xs" truncate>
                    {assigneeName}
                  </Typography>
                  {assigneeEmail ? (
                    <Typography variant="text-xs" color="muted" truncate>
                      {assigneeEmail}
                    </Typography>
                  ) : null}
                </Column>
              </Row>
              <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 gap-2 p-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder={texts.assignee.searchPlaceholder}
                aria-label={texts.assignee.searchAriaLabel}
                autoComplete="off"
              />
              <Column gap="none" width="full" className="max-h-64 overflow-y-auto">
                {options.map((option) => {
                  const selected =
                    option.kind === "unassigned" ? ticket.assignedTo == null : ticket.assignedTo === option.userId;

                  if (option.kind === "assignToMe") {
                    return (
                      <MemberOptionItem
                        key={option.key}
                        selected={selected}
                        onSelect={() => onSelect(option.userId, option.member)}
                        leading={<UserRoundIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                        title={texts.assignee.assignToMe}
                      />
                    );
                  }

                  if (option.kind === "unassigned") {
                    return (
                      <MemberOptionItem
                        key={option.key}
                        selected={selected}
                        onSelect={() => onSelect(null, null)}
                        leading={
                          <Avatar size="sm" className="shrink-0">
                            <AvatarFallback>—</AvatarFallback>
                          </Avatar>
                        }
                        title={texts.sidebar.unassigned}
                      />
                    );
                  }

                  const { member } = option;
                  const name = member.name?.trim() || member.email;

                  return (
                    <MemberOptionItem
                      key={option.key}
                      selected={selected}
                      onSelect={() => onSelect(member.userId, member)}
                      leading={
                        <Avatar size="sm" className="shrink-0">
                          <AvatarFallback>{getProjectMemberInitials(member.name, member.email)}</AvatarFallback>
                        </Avatar>
                      }
                      title={name}
                      subtitle={member.email}
                    />
                  );
                })}
              </Column>
            </DropdownMenuContent>
          </DropdownMenu>
          {inlineError ? (
            <Typography variant="text-xs" color="destructive" align="right">
              {inlineError}
            </Typography>
          ) : null}
        </Column>
      }
    />
  );
}

type MemberOptionItemProps = {
  selected: boolean;
  onSelect: VoidFunction;
  leading: ReactNode;
  title: string;
  subtitle?: string;
};

function MemberOptionItem({ selected, onSelect, leading, title, subtitle }: MemberOptionItemProps) {
  return (
    <DropdownMenuItem aria-selected={selected} className="gap-2 px-2 py-2" onClick={onSelect}>
      {leading}
      <Column gap="none" minWidth="0" className="min-w-0 flex-1">
        <Typography variant="text-sm" truncate>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="text-xs" color="muted" truncate>
            {subtitle}
          </Typography>
        ) : null}
      </Column>
      {selected ? <CheckIcon className="ml-auto size-4 shrink-0 text-foreground" aria-hidden="true" /> : null}
    </DropdownMenuItem>
  );
}

function TicketDetailAssigneePickerFallback() {
  return (
    <TicketDetailPropertyRow
      label={texts.sidebar.assignee}
      value={
        <Row align="center" gap="sm" justify="end" width="full">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-8 w-28" />
        </Row>
      }
    />
  );
}

export function TicketDetailAssigneePicker({ shortId }: TicketDetailAssigneePickerProps) {
  return (
    <Suspense fallback={<TicketDetailAssigneePickerFallback />}>
      <TicketDetailAssigneePickerContent shortId={shortId} />
    </Suspense>
  );
}
