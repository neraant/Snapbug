"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/design-system/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@workspace/design-system/components/ui/sidebar";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { BugIcon, EllipsisVerticalIcon, LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { createElement, type ElementType, type PropsWithChildren } from "react";

export type SidebarItem = {
  href: string;
  label: string;
  icon: ElementType;
};

export type SidebarUser = {
  name: string;
  image?: string | null;
};

type SidebarLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  defaultOpen?: boolean;
  items: SidebarItem[];
  pathname: string;
  user: SidebarUser;
  signOutLabel: string;
  onSignOut: VoidFunction;
  menuLabel?: string;
  themeLabel?: string;
  linkAs?: ElementType;
}>;

const THEME_OPTION = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function SidebarAccountMenu({
  user,
  menuLabel,
  themeLabel,
  signOutLabel,
  onSignOut,
}: {
  user: SidebarUser;
  menuLabel: string;
  themeLabel: string;
  signOutLabel: string;
  onSignOut: VoidFunction;
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton variant="ghost" tooltip={user.name} aria-label={menuLabel} />}>
        <Avatar>
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <Typography
          as="span"
          variant="text-sm"
          color="inherit"
          truncate
          data-sidebar="menu-label"
          className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"
        >
          {user.name}
        </Typography>
        <EllipsisVerticalIcon className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden" />
        <Typography as="span" variant="text-sm" color="inherit" className="sr-only">
          {menuLabel}
        </Typography>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? "bottom" : "top"} align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{themeLabel}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
            {THEME_OPTION.map((option) => {
              const Icon = option.icon;

              return (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <Icon />
                  {option.label}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOutIcon />
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SidebarLayout({
  title,
  description,
  defaultOpen = false,
  items,
  pathname,
  user,
  linkAs,
  signOutLabel,
  onSignOut,
  menuLabel = "More options",
  themeLabel = "Theme",
  children,
}: SidebarLayoutProps) {
  const LinkComponent = linkAs ?? "a";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" variant="ghost" tooltip={title} render={<div />} aria-label={title}>
                <Avatar variant="brand" size="lg" className="shrink-0">
                  <BugIcon className="size-5!" />
                </Avatar>
                <Column
                  gap="none"
                  data-sidebar="menu-label"
                  className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"
                >
                  <Typography as="span" variant="heading-xs" color="inherit" truncate>
                    {title}
                  </Typography>
                  <Typography as="span" variant="text-xs" color="muted" font="mono" truncate>
                    {description}
                  </Typography>
                </Column>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent role="navigation" aria-label="Main">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={createElement(LinkComponent, {
                          href: item.href,
                          "aria-current": isActive ? "page" : undefined,
                        })}
                        isActive={isActive}
                        tooltip={item.label}
                        aria-label={item.label}
                      >
                        <Icon />
                        <Typography
                          as="span"
                          variant="text-sm"
                          color="inherit"
                          data-sidebar="menu-label"
                          className="group-data-[collapsible=icon]:hidden"
                        >
                          {item.label}
                        </Typography>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarAccountMenu
                user={user}
                menuLabel={menuLabel}
                themeLabel={themeLabel}
                signOutLabel={signOutLabel}
                onSignOut={onSignOut}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-svh p-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
