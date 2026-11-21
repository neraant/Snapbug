import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Input } from "@workspace/design-system/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/design-system/components/ui/popover";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { CheckIcon, ChevronDownIcon, UserRoundIcon } from "lucide-react";
import { type ReactNode, Suspense, useId } from "react";

import { getProjectMemberInitials } from "@/client/modules/project/utils/get-project-member-initials.util";
import { TicketDetailPropertyRow } from "@/client/modules/ticket-detail/components/ticket-detail-property-row";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailAssignee } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-assignee";

type TicketDetailAssigneePickerProps = {
  shortId: string;
};

const unassignedOptionKey = "__unassigned__";

function TicketDetailAssigneePickerContent({ shortId }: TicketDetailAssigneePickerProps) {
  const listId = useId();
  const searchId = useId();
  const {
    ticket,
    filteredMembers,
    currentMember,
    open,
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
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isPending}
                  aria-label={texts.assignee.triggerAriaLabel}
                  aria-expanded={open}
                  aria-controls={listId}
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
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 gap-2 p-2">
              <Input
                id={searchId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={texts.assignee.searchPlaceholder}
                aria-label={texts.assignee.searchAriaLabel}
                autoComplete="off"
              />
              <Column
                id={listId}
                role="listbox"
                gap="none"
                width="full"
                className="max-h-64 overflow-y-auto"
                aria-label={texts.assignee.listAriaLabel}
              >
                {options.map((option) => {
                  const selected =
                    option.kind === "unassigned" ? ticket.assignedTo == null : ticket.assignedTo === option.userId;

                  if (option.kind === "assignToMe") {
                    return (
                      <MemberOptionButton
                        key={option.key}
                        selected={selected}
                        onClick={() => onSelect(option.userId, option.member)}
                        leading={<UserRoundIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                        title={texts.assignee.assignToMe}
                      />
                    );
                  }

                  if (option.kind === "unassigned") {
                    return (
                      <MemberOptionButton
                        key={option.key}
                        selected={selected}
                        onClick={() => onSelect(null, null)}
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
                    <MemberOptionButton
                      key={option.key}
                      selected={selected}
                      onClick={() => onSelect(member.userId, member)}
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
            </PopoverContent>
          </Popover>
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

type MemberOptionButtonProps = {
  selected: boolean;
  onClick: VoidFunction;
  leading: ReactNode;
  title: string;
  subtitle?: string;
};

function MemberOptionButton({ selected, onClick, leading, title, subtitle }: MemberOptionButtonProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent/60",
      )}
      onClick={onClick}
    >
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
      {selected ? <CheckIcon className="size-4 shrink-0 text-foreground" aria-hidden="true" /> : null}
    </button>
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
