"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/design-system/components/ui/dialog";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { texts as globalSearchTexts } from "@/client/modules/global-search/consts/texts.const";
import { useGlobalSearchShortcut } from "@/client/modules/global-search/hooks/use-global-search-shortcut";
import { texts as sharedTexts } from "@/client/modules/shared/consts/texts.const";
import { useSearch } from "@/client/modules/shared/queries/use-search";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { url } from "@/shared/build-url.util";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const { data, isFetching } = useSearch({ query: trimmedQuery, enabled: open });

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  useGlobalSearchShortcut({ onOpen: handleOpen });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
    }
  };

  const projects = data?.projects ?? [];
  const tickets = data?.tickets ?? [];
  const hasQuery = trimmedQuery.length > 0;
  const showEmptyResults = hasQuery && !isFetching && projects.length === 0 && tickets.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="hidden h-9 max-w-xs justify-between gap-2 px-3 font-normal text-muted-foreground md:inline-flex md:w-64 lg:w-80"
            aria-label={globalSearchTexts.triggerLabel}
          />
        }
      >
        <Row align="center" gap="sm" wrap={false} minWidth="0" className="min-w-0 flex-1">
          <SearchIcon aria-hidden className="size-4 shrink-0" />
          <Typography variant="text-sm" color="muted" className="truncate">
            {sharedTexts.header.search}
          </Typography>
        </Row>
        <Typography variant="text-xs" color="muted" className="shrink-0">
          {sharedTexts.header.searchShortcut}
        </Typography>
      </DialogTrigger>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle>{globalSearchTexts.dialogTitle}</DialogTitle>
        </DialogHeader>
        <Column gap="md" padding="md" className="max-h-[min(28rem,70vh)] overflow-y-auto">
          <SearchInput
            aria-label={sharedTexts.header.search}
            placeholder={sharedTexts.header.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          {!hasQuery ? (
            <Typography variant="text-sm" color="muted">
              {globalSearchTexts.emptyQuery}
            </Typography>
          ) : null}
          {showEmptyResults ? (
            <Typography variant="text-sm" color="muted">
              {globalSearchTexts.emptyResults}
            </Typography>
          ) : null}
          {projects.length > 0 ? (
            <Column gap="sm">
              <Typography variant="label" color="muted">
                {globalSearchTexts.projectsHeading}
              </Typography>
              <Column gap="xs" as="ul" className="list-none">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={buildPathWithProjectScopeSearchParam(url.ticketsBoard(), project.id)}
                      className="block rounded-md px-2 py-1.5 hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <Typography variant="text-sm">{project.name}</Typography>
                    </Link>
                  </li>
                ))}
              </Column>
            </Column>
          ) : null}
          {tickets.length > 0 ? (
            <Column gap="sm">
              <Typography variant="label" color="muted">
                {globalSearchTexts.ticketsHeading}
              </Typography>
              <Column gap="xs" as="ul" className="list-none">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <Link
                      href={buildPathWithProjectScopeSearchParam(url.ticket(ticket.shortId), ticket.projectId)}
                      className="block rounded-md px-2 py-1.5 hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <Typography variant="text-sm">{ticket.title}</Typography>
                      <Typography variant="text-xs" color="muted">
                        {globalSearchTexts.ticketMeta(ticket.shortId, ticket.projectName)}
                      </Typography>
                    </Link>
                  </li>
                ))}
              </Column>
            </Column>
          ) : null}
        </Column>
      </DialogContent>
    </Dialog>
  );
}
