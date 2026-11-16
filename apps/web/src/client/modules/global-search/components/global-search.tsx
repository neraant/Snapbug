"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@workspace/design-system/components/ui/dialog";
import { Input } from "@workspace/design-system/components/ui/input";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Spinner } from "@workspace/design-system/components/ui/spinner";
import { StatusIndicator } from "@workspace/design-system/components/ui/status-indicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { SearchOutputDtoType } from "@workspace/validation/modules/search/dto/search.schema";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { bugReportSeveritySearchIcon } from "@/client/modules/global-search/consts/bug-report-severity-search-icon.const";
import { globalSearchResultsPanelHeightClass } from "@/client/modules/global-search/consts/global-search.const";
import { texts } from "@/client/modules/global-search/consts/texts.const";
import {
  type GlobalSearchSelectableItem,
  useGlobalSearch,
} from "@/client/modules/global-search/hooks/use-global-search";
import { useGlobalSearchShortcut } from "@/client/modules/global-search/hooks/use-global-search-shortcut";
import { useSearchShortcutHint } from "@/client/modules/global-search/hooks/use-search-shortcut-hint";
import { highlightSearchMatch } from "@/client/modules/global-search/utils/highlight-search-match.util";
import { formatProjectSlugLabel } from "@/client/modules/project/utils/format-project-slug-label.util";
import { getProjectInitials } from "@/client/modules/project/utils/get-project-initials.util";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { url } from "@/shared/build-url.util";

type SearchProjectResult = SearchOutputDtoType["projects"][number];
type SearchTicketResult = SearchOutputDtoType["tickets"][number];

export function GlobalSearch() {
  const router = useRouter();
  const shortcutHint = useSearchShortcutHint();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogInputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    setQuery,
    trimmedQuery,
    debouncedQuery,
    recentItems,
    grouped,
    selectableItems,
    showInitialSkeleton,
    showEmptyResults,
    isFetching,
    recordTicketOpen,
    recordProjectOpen,
  } = useGlobalSearch({ open });

  const waitingForDebounce = trimmedQuery.length > 0 && debouncedQuery !== trimmedQuery;
  const waitingForFetch = debouncedQuery.length > 0 && isFetching;
  const dimResults = waitingForDebounce || waitingForFetch;

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  useGlobalSearchShortcut({ onOpen: handleOpen });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex(0);
    const frameId = window.requestAnimationFrame(() => {
      dialogInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [open, trimmedQuery, selectableItems.length]);

  const resolveItemHref = useCallback((item: GlobalSearchSelectableItem): string => {
    switch (item.type) {
      case "ticket":
        return buildPathWithProjectScopeSearchParam(url.ticket(item.ticket.shortId), item.ticket.projectId);
      case "project":
        return buildPathWithProjectScopeSearchParam(url.ticketsBoard(), item.project.id);
      case "show-all-tickets":
        return url.ticketsBoard();
      case "show-all-projects":
        return url.projects();
    }
  }, []);

  const activateItem = useCallback(
    (item: GlobalSearchSelectableItem, openInNewTab: boolean) => {
      const href = resolveItemHref(item);

      if (item.type === "ticket") {
        recordTicketOpen(item.ticket);
      } else if (item.type === "project") {
        recordProjectOpen(item.project);
      }

      setOpen(false);
      setQuery("");

      if (openInNewTab) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      router.push(href);
    },
    [recordProjectOpen, recordTicketOpen, resolveItemHref, router],
  );

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (selectableItems.length === 0) {
        return;
      }

      setActiveIndex((current) => Math.min(current + 1, selectableItems.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (selectableItems.length === 0) {
        return;
      }

      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const item = selectableItems[activeIndex];
      if (!item) {
        return;
      }

      event.preventDefault();
      activateItem(item, event.metaKey || event.ctrlKey);
    }
  };

  const clearQuery = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setQuery("");
    dialogInputRef.current?.focus();
  };

  const showRecent = trimmedQuery.length === 0 && recentItems.length > 0;
  const showEmptyQueryHint = trimmedQuery.length === 0 && recentItems.length === 0;
  const highlightQuery = debouncedQuery.length > 0 ? debouncedQuery : trimmedQuery;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Row align="center" gap="sm" wrap={false} className="shrink-0">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label={texts.triggerLabel}
                onClick={handleOpen}
              />
            }
          >
            <SearchIcon className="size-4" aria-hidden />
          </TooltipTrigger>
          <TooltipContent>{texts.triggerLabel}</TooltipContent>
        </Tooltip>

        <Button
          type="button"
          variant="outline"
          className="hidden h-9 w-[280px] shrink-0 justify-between gap-2 px-3 font-normal text-muted-foreground md:inline-flex"
          aria-label={texts.triggerLabel}
          onClick={handleOpen}
        >
          <Row align="center" gap="sm" wrap={false} minWidth="0" className="min-w-0 flex-1">
            <SearchIcon aria-hidden className="size-4 shrink-0" />
            <Typography variant="text-sm" color="muted" className="truncate">
              {texts.placeholder}
            </Typography>
          </Row>
          <Typography
            as="span"
            variant="text-xs"
            color="muted"
            font="mono"
            className="shrink-0 rounded border border-border bg-muted/60 px-1.5 py-0.5"
          >
            {shortcutHint}
          </Typography>
        </Button>
      </Row>

      <DialogContent
        showClose={false}
        className="top-[15vh] max-w-[560px] !-translate-x-1/2 !translate-y-0 gap-0 overflow-hidden p-0"
        onKeyDown={handleDialogKeyDown}
      >
        <DialogTitle className="sr-only">{texts.dialogTitle}</DialogTitle>

        <Row align="center" gap="sm" wrap={false} className="border-b border-border px-3 py-2" width="full">
          {waitingForFetch ? (
            <Spinner className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          )}
          <Input
            ref={dialogInputRef}
            type="search"
            role="searchbox"
            aria-label={texts.placeholder}
            placeholder={texts.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label={texts.clearQuery}
              onMouseDown={(event) => event.preventDefault()}
              onClick={clearQuery}
            >
              <XIcon aria-hidden />
            </Button>
          ) : null}
        </Row>

        <Column
          gap="md"
          padding="sm"
          className={cn(globalSearchResultsPanelHeightClass, "overflow-y-auto")}
          role="listbox"
          aria-label={texts.dialogTitle}
        >
          <Column
            gap="md"
            className={cn(dimResults && grouped.tickets.length + grouped.projects.length > 0 && "opacity-60")}
          >
            {showInitialSkeleton ? <GlobalSearchSkeletonRows /> : null}

            {showEmptyQueryHint ? (
              <Typography variant="text-sm" color="muted" className="px-2 py-3">
                {texts.noRecentHint}
              </Typography>
            ) : null}

            {showRecent ? (
              <GlobalSearchGroup heading={texts.recentHeading}>
                {recentItems.map((item, index) =>
                  item.kind === "ticket" ? (
                    <GlobalSearchTicketRow
                      key={item.id}
                      ticket={item}
                      query={highlightQuery}
                      active={activeIndex === index}
                      onHover={() => setActiveIndex(index)}
                      onOpen={(openInNewTab) => activateItem({ type: "ticket", ticket: item }, openInNewTab)}
                    />
                  ) : (
                    <GlobalSearchProjectRow
                      key={item.id}
                      project={item}
                      query={highlightQuery}
                      active={activeIndex === index}
                      onHover={() => setActiveIndex(index)}
                      onOpen={(openInNewTab) => activateItem({ type: "project", project: item }, openInNewTab)}
                    />
                  ),
                )}
              </GlobalSearchGroup>
            ) : null}

            {showEmptyResults ? (
              <Column gap="xs" padding="sm">
                <Typography variant="text-sm">{texts.emptyResults(trimmedQuery)}</Typography>
                <Typography variant="text-sm" color="muted">
                  {texts.emptyResultsHint}
                </Typography>
              </Column>
            ) : null}

            {trimmedQuery.length > 0 && grouped.tickets.length > 0 ? (
              <GlobalSearchGroup heading={texts.ticketsHeading}>
                {grouped.visibleTickets.map((ticket, ticketIndex) => {
                  const itemIndex = selectableItems.findIndex(
                    (entry) => entry.type === "ticket" && entry.ticket.id === ticket.id,
                  );

                  return (
                    <GlobalSearchTicketRow
                      key={ticket.id}
                      ticket={ticket}
                      query={highlightQuery}
                      active={activeIndex === itemIndex}
                      onHover={() => setActiveIndex(itemIndex)}
                      onOpen={(openInNewTab) => activateItem({ type: "ticket", ticket }, openInNewTab)}
                    />
                  );
                })}
                {grouped.hasMoreTickets ? (
                  <GlobalSearchShowAllRow
                    label={texts.showAllTickets}
                    active={selectableItems[activeIndex]?.type === "show-all-tickets"}
                    onHover={() => {
                      const index = selectableItems.findIndex((entry) => entry.type === "show-all-tickets");
                      if (index >= 0) {
                        setActiveIndex(index);
                      }
                    }}
                    onOpen={(openInNewTab) => activateItem({ type: "show-all-tickets" }, openInNewTab)}
                  />
                ) : null}
              </GlobalSearchGroup>
            ) : null}

            {trimmedQuery.length > 0 && grouped.projects.length > 0 ? (
              <GlobalSearchGroup heading={texts.projectsHeading}>
                {grouped.visibleProjects.map((project, projectIndex) => {
                  const offset = grouped.visibleTickets.length + (grouped.hasMoreTickets ? 1 : 0);
                  const itemIndex = offset + projectIndex;

                  return (
                    <GlobalSearchProjectRow
                      key={project.id}
                      project={project}
                      query={highlightQuery}
                      active={activeIndex === itemIndex}
                      onHover={() => setActiveIndex(itemIndex)}
                      onOpen={(openInNewTab) => activateItem({ type: "project", project }, openInNewTab)}
                    />
                  );
                })}
                {grouped.hasMoreProjects ? (
                  <GlobalSearchShowAllRow
                    label={texts.showAllProjects}
                    active={selectableItems[activeIndex]?.type === "show-all-projects"}
                    onHover={() => {
                      const index = selectableItems.findIndex((entry) => entry.type === "show-all-projects");
                      if (index >= 0) {
                        setActiveIndex(index);
                      }
                    }}
                    onOpen={(openInNewTab) => activateItem({ type: "show-all-projects" }, openInNewTab)}
                  />
                ) : null}
              </GlobalSearchGroup>
            ) : null}
          </Column>
        </Column>

        <Row align="center" justify="center" className="border-t border-border bg-muted/30 px-3 py-2" width="full">
          <Typography variant="text-xs" color="muted">
            {texts.footerHint}
          </Typography>
        </Row>
      </DialogContent>
    </Dialog>
  );
}

type GlobalSearchGroupProps = {
  heading: string;
  children: ReactNode;
};

function GlobalSearchGroup({ heading, children }: GlobalSearchGroupProps) {
  return (
    <Column gap="xs" width="full">
      <Typography variant="text-xs" color="muted" className="px-2">
        {heading}
      </Typography>
      <Column gap="none" as="ul" className="list-none" width="full">
        {children}
      </Column>
    </Column>
  );
}

type GlobalSearchTicketRowProps = {
  ticket: SearchTicketResult;
  query: string;
  active: boolean;
  onHover: () => void;
  onOpen: (openInNewTab: boolean) => void;
};

function GlobalSearchTicketRow({ ticket, query, active, onHover, onOpen }: GlobalSearchTicketRowProps) {
  const SeverityIcon = bugReportSeveritySearchIcon[ticket.severity];

  return (
    <li>
      <Row
        align="center"
        gap="sm"
        wrap={false}
        width="full"
        role="option"
        aria-selected={active}
        tabIndex={-1}
        className={cn("cursor-pointer rounded-md px-2 py-2", active ? "bg-muted" : "hover:bg-muted/70")}
        onMouseEnter={onHover}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onOpen(event.metaKey || event.ctrlKey);
          }
        }}
      >
        <StatusIndicator status={ticket.status} aria-label={texts.statusLabels[ticket.status]} className="shrink-0" />
        <Column gap="none" minWidth="0" className="min-w-0 flex-1">
          <Row align="center" gap="sm" wrap={false} minWidth="0">
            <Typography variant="text-xs" color="muted" font="mono" className="shrink-0">
              {ticket.shortId}
            </Typography>
            <Typography variant="text-sm" truncate className="min-w-0 flex-1">
              {highlightSearchMatch(ticket.title, query)}
            </Typography>
          </Row>
        </Column>
        <Row align="center" gap="xs" wrap={false} className="shrink-0">
          <Badge variant="secondary">{ticket.projectName}</Badge>
          <SeverityIcon className="size-4 text-muted-foreground" aria-label={texts.severityLabels[ticket.severity]} />
        </Row>
      </Row>
    </li>
  );
}

type GlobalSearchProjectRowProps = {
  project: SearchProjectResult;
  query: string;
  active: boolean;
  onHover: () => void;
  onOpen: (openInNewTab: boolean) => void;
};

function GlobalSearchProjectRow({ project, query, active, onHover, onOpen }: GlobalSearchProjectRowProps) {
  return (
    <li>
      <Row
        align="center"
        gap="sm"
        wrap={false}
        width="full"
        role="option"
        aria-selected={active}
        tabIndex={-1}
        className={cn("cursor-pointer rounded-md px-2 py-2", active ? "bg-muted" : "hover:bg-muted/70")}
        onMouseEnter={onHover}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onOpen(event.metaKey || event.ctrlKey);
          }
        }}
      >
        <Avatar variant="brand" size="sm" color={project.color} className="shrink-0">
          <AvatarFallback>{getProjectInitials(project.name)}</AvatarFallback>
        </Avatar>
        <Column gap="none" minWidth="0" className="min-w-0 flex-1">
          <Typography variant="text-sm" truncate>
            {highlightSearchMatch(project.name, query)}
          </Typography>
          <Typography variant="text-xs" color="muted" truncate>
            {formatProjectSlugLabel(project.slug)}
          </Typography>
        </Column>
      </Row>
    </li>
  );
}

type GlobalSearchShowAllRowProps = {
  label: string;
  active: boolean;
  onHover: () => void;
  onOpen: (openInNewTab: boolean) => void;
};

function GlobalSearchShowAllRow({ label, active, onHover, onOpen }: GlobalSearchShowAllRowProps) {
  return (
    <li>
      <Row
        align="center"
        width="full"
        role="option"
        aria-selected={active}
        tabIndex={-1}
        className={cn("cursor-pointer rounded-md px-2 py-2", active ? "bg-muted" : "hover:bg-muted/70")}
        onMouseEnter={onHover}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onOpen(event.metaKey || event.ctrlKey);
          }
        }}
      >
        <Typography variant="text-sm" color="muted">
          {label}
        </Typography>
      </Row>
    </li>
  );
}

function GlobalSearchSkeletonRows() {
  return (
    <Column gap="sm" width="full" padding="sm">
      {Array.from({ length: 4 }, (_, index) => (
        <Row key={index} align="center" gap="sm" width="full">
          <Skeleton className="size-2 rounded-full" />
          <Column gap="xs" className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </Column>
        </Row>
      ))}
    </Column>
  );
}
