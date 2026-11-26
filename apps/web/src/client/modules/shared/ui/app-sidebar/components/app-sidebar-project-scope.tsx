"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { useSidebar } from "@workspace/design-system/components/ui/sidebar";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { AstroidIcon, ChevronDownIcon } from "lucide-react";
import { useMemo } from "react";

import { overviewStatAllProjectsValue } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { texts as overviewTexts } from "@/client/modules/overview/consts/texts.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { useRestoreProjectScopeSearchParam } from "@/client/modules/shared/ui/app-sidebar/hooks/use-restore-project-scope-search-param";

function getProjectScopeLabel(projectId: string | null, projectLabelById: Map<string, string>) {
  if (projectId == null) {
    return overviewTexts.filter.project.allProjects;
  }

  return projectLabelById.get(projectId) ?? overviewTexts.filter.project.allProjects;
}

function getProjectScopeInitial(projectId: string | null, projectNameById: Map<string, string>) {
  if (projectId == null) {
    return <AstroidIcon className="size-2" />;
  }

  const name = projectNameById.get(projectId);
  if (!name) return "?";

  return name[0]?.toUpperCase() ?? "?";
}

type AppSidebarProjectScopeTriggerProps = {
  isIconMode: boolean;
  label: string;
  projectId: string | null;
  projectLabelById: Map<string, string>;
};

function AppSidebarProjectScopeTrigger({
  isIconMode,
  label,
  projectId,
  projectLabelById,
}: AppSidebarProjectScopeTriggerProps) {
  const triggerButton = (
    <DropdownMenuTrigger
      render={
        <Button
          type="button"
          variant="outline"
          aria-label={overviewTexts.filter.project.ariaLabel}
          className={cn(
            "h-auto w-full justify-between gap-2 border-border bg-card px-2 py-2 shadow-xs",
            isIconMode && "size-8 justify-center p-0",
          )}
        />
      }
    >
      {isIconMode ? (
        <Avatar variant="brand" size="xs" className="rounded-md">
          <AvatarFallback className="font-mono text-[10px] font-bold">
            {getProjectScopeInitial(projectId, projectLabelById)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <>
          <Row align="center" gap="sm" wrap={false} className="min-w-0 flex-1">
            <Avatar variant="brand" size="xs" className="rounded-md">
              <AvatarFallback className="font-mono text-[10px] font-bold">
                {getProjectScopeInitial(projectId, projectLabelById)}
              </AvatarFallback>
            </Avatar>
            <Typography as="span" variant="text-xs" weight="semibold" truncate className="min-w-0">
              {label}
            </Typography>
          </Row>
          <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        </>
      )}
    </DropdownMenuTrigger>
  );

  if (!isIconMode) {
    return triggerButton;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={triggerButton} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebarProjectScope() {
  const { state } = useSidebar();
  const isIconMode = state === "collapsed";
  const { projectId, setProjectId } = useProjectScopeSearchParam();
  const { data: projects } = useFindProjects();

  useRestoreProjectScopeSearchParam();

  const sortedProjects = useMemo(
    () => [...projects].sort((left, right) => left.name.localeCompare(right.name)),
    [projects],
  );

  const projectLabelById = useMemo(
    () => new Map(sortedProjects.map((project) => [project.id, `${project.name} · ${project.slug}`])),
    [sortedProjects],
  );

  const selectedValue = projectId ?? overviewStatAllProjectsValue;
  const label = getProjectScopeLabel(projectId, projectLabelById);

  return (
    <DropdownMenu>
      <AppSidebarProjectScopeTrigger
        isIconMode={isIconMode}
        label={label}
        projectId={projectId}
        projectLabelById={projectLabelById}
      />
      <DropdownMenuContent align="start" className="max-h-80">
        <DropdownMenuRadioGroup
          value={selectedValue}
          onValueChange={(value) => {
            setProjectId(value === overviewStatAllProjectsValue ? null : value);
          }}
        >
          <DropdownMenuRadioItem value={overviewStatAllProjectsValue}>
            {overviewTexts.filter.project.allProjects}
          </DropdownMenuRadioItem>
          {sortedProjects.map((project) => (
            <DropdownMenuRadioItem key={project.id} value={project.id}>
              <Column gap="none" minWidth="0">
                <Typography as="span" variant="text-sm" truncate>
                  {project.name}
                </Typography>
                <Typography as="span" variant="text-xs" color="muted" truncate>
                  {project.slug}
                </Typography>
              </Column>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebarProjectScopeFallback() {
  const { state } = useSidebar();
  const isIconMode = state === "collapsed";

  return <Skeleton className={cn("rounded-lg", isIconMode ? "size-8" : "h-9 w-full")} />;
}

AppSidebarProjectScope.Fallback = AppSidebarProjectScopeFallback;
