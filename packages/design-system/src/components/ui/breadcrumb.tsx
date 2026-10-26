"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Row } from "@workspace/design-system/components/layout/row";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps } from "react";

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" className={cn("min-w-0", className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<typeof Row>) {
  return (
    <Row
      as="ol"
      align="center"
      wrap={false}
      minWidth="0"
      data-slot="breadcrumb-list"
      className={cn("gap-0", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex min-w-0 items-center", className)} {...props} />;
}

function BreadcrumbLink({ render, className, ...props }: useRender.ComponentProps<"a"> & ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "font-heading text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
          className,
        ),
      },
      props,
    ),
    render,
  });
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("min-w-0 truncate font-heading text-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ className, children, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("px-1.5 font-heading text-sm text-muted-foreground select-none", className)}
      {...props}
    >
      {children ?? "/"}
    </li>
  );
}

Breadcrumb.List = BreadcrumbList;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.Page = BreadcrumbPage;
Breadcrumb.Separator = BreadcrumbSeparator;
