import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { useSidebar } from "@workspace/design-system/components/ui/sidebar";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { ChevronDownIcon } from "lucide-react";

import { AppSidebarCreateOrganization } from "@/client/modules/shared/ui/app-sidebar/components/app-sidebar-create-organization";
import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { useAppSidebarOrganizationSwitcher } from "@/client/modules/shared/ui/app-sidebar/hooks/use-app-sidebar-organization-switcher";

type AppSidebarOrganizationSwitcherTriggerProps = {
  isIconMode: boolean;
  label: string;
};

function AppSidebarOrganizationSwitcherTrigger({ isIconMode, label }: AppSidebarOrganizationSwitcherTriggerProps) {
  const initial = label[0]?.toUpperCase() ?? "?";
  const triggerButton = (
    <DropdownMenuTrigger
      render={
        <Button
          type="button"
          variant="outline"
          aria-label={texts.organization.ariaLabel}
          className={cn(
            "h-auto w-full justify-between gap-2 border-border bg-card px-2 py-2 shadow-xs",
            isIconMode && "size-8 justify-center p-0",
          )}
        />
      }
    >
      {isIconMode ? (
        <Avatar variant="brand" size="xs" className="rounded-md">
          <AvatarFallback className="font-mono text-[10px] font-bold">{initial}</AvatarFallback>
        </Avatar>
      ) : (
        <>
          <Row align="center" gap="sm" wrap={false} className="min-w-0 flex-1">
            <Avatar variant="brand" size="xs" className="rounded-md">
              <AvatarFallback className="font-mono text-[10px] font-bold">{initial}</AvatarFallback>
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

export function AppSidebarOrganizationSwitcher() {
  const { state } = useSidebar();
  const isIconMode = state === "collapsed";
  const { activeOrganizationId, chooseOrganization, createOpen, label, setCreateOpen, sortedOrganizations } =
    useAppSidebarOrganizationSwitcher();

  return (
    <>
      <DropdownMenu>
        <AppSidebarOrganizationSwitcherTrigger isIconMode={isIconMode} label={label} />
        <DropdownMenuContent align="start" className="max-h-80">
          <DropdownMenuRadioGroup
            value={activeOrganizationId ?? ""}
            onValueChange={(value) => {
              chooseOrganization(value).catch(() => {
                return undefined;
              });
            }}
          >
            {sortedOrganizations.map((organization) => (
              <DropdownMenuRadioItem key={organization.organizationId} value={organization.organizationId}>
                <Row align="center" justify="between" gap="sm" wrap={false} className="w-full">
                  <Typography as="span" variant="text-sm" truncate>
                    {organization.name}
                  </Typography>
                  <Typography as="span" variant="text-xs" color="muted">
                    {texts.organization.role[organization.role]}
                  </Typography>
                </Row>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCreateOpen(true);
            }}
          >
            {texts.organization.create}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AppSidebarCreateOrganization open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}

function AppSidebarOrganizationSwitcherFallback() {
  const { state } = useSidebar();
  const isIconMode = state === "collapsed";

  return <Skeleton className={cn("rounded-lg", isIconMode ? "size-8" : "h-9 w-full")} />;
}

AppSidebarOrganizationSwitcher.Fallback = AppSidebarOrganizationSwitcherFallback;
