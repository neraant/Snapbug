import { Column } from "@workspace/design-system/components/layout/column";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { ArchiveIcon, EllipsisVerticalIcon, SettingsIcon } from "lucide-react";
import { Suspense, useState } from "react";

import { ProjectCardMember } from "@/client/modules/project/components/project-card-member";
import { ProjectSettingsSheet } from "@/client/modules/project/components/project-settings-sheet";
import { texts } from "@/client/modules/project/consts/texts.const";
import { useProjectDangerActions } from "@/client/modules/project/hooks/use-project-danger-actions";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { formatProjectCreatedDate } from "@/client/modules/project/utils/format-project-created-date.util";
import { getProjectInitials } from "@/client/modules/project/utils/get-project-initials.util";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";

type ProjectCardProps = {
  project: ProjectListItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const createdLabel = formatProjectCreatedDate(project.createdAt);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isArchived = project.archivedAt != null;
  const { confirm, bind } = useConfirmDialog();
  const { onArchive } = useProjectDangerActions({
    project,
    onProjectChanged: () => undefined,
    onProjectDeleted: () => undefined,
  });

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

  return (
    <>
      <Card width="full" padding="none" gap="none">
        <Card.Header>
          <Card.Icon className="size-auto">
            <Avatar variant="brand" size="lg" color={project.color}>
              <AvatarFallback>{getProjectInitials(project.name)}</AvatarFallback>
            </Avatar>
          </Card.Icon>
          <Card.Title variant="heading-xs">{project.name}</Card.Title>
          {isArchived ? <Badge variant="secondary">{texts.card.archivedBadge}</Badge> : null}
          <Card.Action>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button type="button" variant="ghost" size="icon-sm" aria-label={texts.card.menu} />}
              >
                <EllipsisVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <SettingsIcon />
                  {texts.card.settings}
                </DropdownMenuItem>
                {!isArchived ? (
                  <DropdownMenuItem onClick={openArchiveConfirm}>
                    <ArchiveIcon />
                    {texts.card.archive}
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </Card.Action>
        </Card.Header>
        <Card.Content padding="md">
          <Column gap="xs">
            <Badge variant="outline">{texts.card.openIssues(project.openCount)}</Badge>
            <Typography variant="text-xs" color="muted">
              {texts.card.created(createdLabel)}
            </Typography>
          </Column>
        </Card.Content>
        <Separator />
        <Card.Content padding="md">
          <ProjectCardMember projectId={project.id} />
        </Card.Content>
      </Card>
      {settingsOpen ? (
        <Suspense fallback={null}>
          <ProjectSettingsSheet project={project} open={settingsOpen} onOpenChange={setSettingsOpen} />
        </Suspense>
      ) : null}
      <ConfirmDialog {...bind()} />
    </>
  );
}
