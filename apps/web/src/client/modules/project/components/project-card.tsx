import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import {
  ArchiveIcon,
  CircleDotIcon,
  ClockIcon,
  CodeIcon,
  EllipsisVerticalIcon,
  SettingsIcon,
  TicketIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, Suspense, useCallback, useState } from "react";

import { ProjectCardMember } from "@/client/modules/project/components/project-card-member";
import { ProjectSettingsSheet } from "@/client/modules/project/components/project-settings-sheet";
import { texts } from "@/client/modules/project/consts/texts.const";
import { useProjectDangerActions } from "@/client/modules/project/hooks/use-project-danger-actions";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { formatProjectCreatedDate } from "@/client/modules/project/utils/format-project-created-date.util";
import { formatProjectLastTicketRelative } from "@/client/modules/project/utils/format-project-last-ticket.util";
import { formatProjectSlugLabel } from "@/client/modules/project/utils/format-project-slug-label.util";
import { getProjectInitials } from "@/client/modules/project/utils/get-project-initials.util";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { url } from "@/shared/build-url.util";

type ProjectCardProps = {
  project: ProjectListItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const createdLabel = formatProjectCreatedDate(project.createdAt);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isArchived = project.archivedAt != null;
  const { confirm, bind } = useConfirmDialog();
  const { data: membership } = useFindMembershipByUser();
  const isAdmin = membership?.role === UserRole.ADMIN;
  const { onArchive, onRestore, onDelete } = useProjectDangerActions({
    project,
    onProjectChanged: () => undefined,
    onProjectDeleted: () => undefined,
  });

  const ticketsHref = buildPathWithProjectScopeSearchParam(url.ticketsBoard(), project.id);
  const sdkHref = buildPathWithProjectScopeSearchParam(url.sdk(), project.id);
  const lastTicketLabel = formatProjectLastTicketRelative(project.lastTicketAt, texts.card.noTicketsYet);

  const openSdkSetup = useCallback(() => {
    router.push(sdkHref);
  }, [router, sdkHref]);

  const openArchiveConfirm = () => {
    confirm({
      title: texts.card.archiveDialog.title(project.name),
      description: texts.card.archiveDialog.description(project.name),
      confirmLabel: texts.card.archiveDialog.confirm,
      variant: "default",
      errorFallback: texts.settingsSheet.toast.archiveError,
      onConfirm: async () => {
        try {
          await onArchive();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.archiveError));
        }
      },
    });
  };

  const openRestoreConfirm = () => {
    confirm({
      title: texts.card.restoreDialog.title(project.name),
      description: texts.card.restoreDialog.description(project.name),
      confirmLabel: texts.card.restoreDialog.confirm,
      variant: "default",
      errorFallback: texts.settingsSheet.toast.restoreError,
      onConfirm: async () => {
        try {
          await onRestore();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.restoreError));
        }
      },
    });
  };

  const openDeleteConfirm = () => {
    confirm({
      title: texts.card.deleteDialog.title(project.name),
      description: texts.card.deleteDialog.description(),
      confirmLabel: texts.card.deleteDialog.confirm,
      variant: "destructive",
      confirmText: project.name,
      errorFallback: texts.settingsSheet.toast.deleteError,
      onConfirm: async () => {
        try {
          await onDelete();
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.settingsSheet.toast.deleteError));
        }
      },
    });
  };

  const stopMenuPointer = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  return (
    <>
      <ProjectCardLink
        isArchived={isArchived}
        ariaLabel={texts.card.navigateToTickets(project.name)}
        href={ticketsHref}
      >
        {isArchived ? (
          <Row align="center" gap="xs" className="border-b border-border bg-muted/60 px-3 py-1.5 text-muted-foreground">
            <ArchiveIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <Typography variant="text-xs" color="muted">
              {texts.card.archivedStrip}
            </Typography>
          </Row>
        ) : null}
        <Column gap="md" padding="md" width="full" minWidth="0">
          <Row align="center" justify="between" gap="sm" width="full" wrap={false}>
            <Avatar
              variant="brand"
              size="lg"
              color={project.color}
              className={cn(isArchived && "opacity-70 grayscale")}
            >
              <AvatarFallback>{getProjectInitials(project.name)}</AvatarFallback>
            </Avatar>
            <div className="pointer-events-auto" onPointerDown={stopMenuPointer} onClick={stopMenuPointer}>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button type="button" variant="ghost" size="icon-sm" aria-label={texts.card.menu} />}
                >
                  <EllipsisVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSettingsOpen(true);
                    }}
                  >
                    <SettingsIcon />
                    {texts.card.settings}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openSdkSetup}>
                    <CodeIcon />
                    {texts.card.openSdkSetup}
                  </DropdownMenuItem>
                  {isArchived ? (
                    <DropdownMenuItem onClick={openRestoreConfirm}>
                      <ArchiveIcon />
                      {texts.card.restore}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={openArchiveConfirm}>
                      <ArchiveIcon />
                      {texts.card.archive}
                    </DropdownMenuItem>
                  )}
                  {isAdmin ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={openDeleteConfirm}>
                        <Trash2Icon />
                        {texts.card.delete}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Row>
          <Column gap="xs" width="full" minWidth="0" className={cn(isArchived && "opacity-80")}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Typography variant="heading-xs" className="truncate">
                    {project.name}
                  </Typography>
                }
              />
              <TooltipContent>{project.name}</TooltipContent>
            </Tooltip>
            <Typography variant="text-xs" color="muted" font="mono" className="truncate">
              {formatProjectSlugLabel(project.slug)}
            </Typography>
          </Column>
          <Row align="center" gap="md" wrap className={cn("text-muted-foreground", isArchived && "opacity-80")}>
            <Row align="center" gap="xs" wrap={false}>
              <CircleDotIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <Typography variant="text-xs" color="muted">
                {texts.card.openTickets(project.openCount)}
              </Typography>
            </Row>
            <Row align="center" gap="xs" wrap={false}>
              <TicketIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <Typography variant="text-xs" color="muted">
                {texts.card.totalTickets(project.totalCount)}
              </Typography>
            </Row>
            <Row align="center" gap="xs" wrap={false} minWidth="0">
              <ClockIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <Typography variant="text-xs" color="muted" className="truncate">
                {project.lastTicketAt ? texts.card.lastTicket(lastTicketLabel) : lastTicketLabel}
              </Typography>
            </Row>
          </Row>
          <Row align="center" justify="between" gap="sm" width="full" wrap={false}>
            <ProjectCardMember projectId={project.id} />
            <Typography variant="text-xs" color="muted" className="shrink-0">
              {texts.card.created(createdLabel)}
            </Typography>
          </Row>
        </Column>
      </ProjectCardLink>
      {settingsOpen ? (
        <Suspense fallback={null}>
          <ProjectSettingsSheet project={project} open={settingsOpen} onOpenChange={setSettingsOpen} />
        </Suspense>
      ) : null}
      <ConfirmDialog {...bind()} />
    </>
  );
}

type ProjectCardLinkProps = PropsWithChildren<{
  isArchived: boolean;
  ariaLabel: string;
  href: string;
}>;

function ProjectCardLink({ children, isArchived, ariaLabel, href }: ProjectCardLinkProps) {
  return (
    <Card
      width="full"
      padding="none"
      gap="none"
      className={cn(
        "relative h-full border-border shadow-xs transition-[box-shadow,border-color] hover:border-border/80 hover:shadow-md",
        isArchived && "bg-muted/20 opacity-90",
      )}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(
          "absolute inset-0 z-[1] block rounded-lg outline-none",
          "focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
      />
      <Column gap="none" width="full" className="pointer-events-none relative z-[2]">
        {children}
      </Column>
    </Card>
  );
}
