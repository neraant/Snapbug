"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps } from "react";

function Tabs(props: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn("flex w-full flex-col gap-4", props.className)} {...props} />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      role="tablist"
      activateOnFocus
      loopFocus
      className={cn("relative flex items-center gap-1 overflow-x-auto border-b border-border", className)}
      {...props}
    />
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center gap-2 rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
        "hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-active:border-primary data-active:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn("absolute bottom-0 left-0 z-0 h-0.5 bg-primary transition-[left,width] duration-200", className)}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      role="tabpanel"
      className={cn("min-w-0 focus-visible:outline-none", className)}
      {...props}
    />
  );
}

type TabsBadgeProps = ComponentProps<"span">;

function TabsBadge({ className, ...props }: TabsBadgeProps) {
  return (
    <span
      data-slot="tabs-badge"
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsBadge, TabsIndicator, TabsList, TabsPanel, TabsTab };
