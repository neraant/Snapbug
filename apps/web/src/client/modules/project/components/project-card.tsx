import { Column } from "@workspace/design-system/components/layout/column";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { ArchiveIcon, EllipsisVerticalIcon, SettingsIcon } from "lucide-react";

import { ProjectCardMember } from "@/client/modules/project/components/project-card-member";
import { texts } from "@/client/modules/project/consts/texts.const";
import type { ProjectListItem } from "@/client/modules/project/types/project-list-item.type";
import { formatProjectCreatedDate } from "@/client/modules/project/utils/format-project-created-date.util";
import { getProjectInitials } from "@/client/modules/project/utils/get-project-initials.util";

type ProjectCardProps = {
  project: ProjectListItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const createdLabel = formatProjectCreatedDate(project.createdAt);

  return (
    <Card width="full" padding="none" gap="none">
      <Card.Header>
        <Card.Icon className="size-auto">
          <Avatar variant="brand" size="lg" color={project.color}>
            <AvatarFallback>{getProjectInitials(project.name)}</AvatarFallback>
          </Avatar>
        </Card.Icon>
        <Card.Title variant="heading-xs">{project.name}</Card.Title>
        <Card.Action>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button type="button" variant="ghost" size="icon-sm" aria-label={texts.card.menu} />}
            >
              <EllipsisVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <SettingsIcon />
                {texts.card.settings}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                {texts.card.archive}
              </DropdownMenuItem>
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
        <ProjectCardMember />
      </Card.Content>
    </Card>
  );
}
