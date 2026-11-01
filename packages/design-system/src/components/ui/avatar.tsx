"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const avatarVariants = cva(
  "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden align-middle text-xs font-medium select-none",
  {
    variants: {
      variant: {
        default: "rounded-full bg-muted text-muted-foreground",
        brand: "rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
      },
      size: {
        xs: "size-5 text-xs",
        sm: "size-6 text-xs",
        md: "size-7 text-sm",
        lg: "size-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Avatar({
  className,
  variant = "default",
  size,
  color,
  style,
  ...props
}: AvatarPrimitive.Root.Props &
  VariantProps<typeof avatarVariants> & {
    color?: string;
  }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ variant, size }), color && "text-white", className)}
      style={color ? { ...style, backgroundColor: color } : style}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", className)}
      {...props}
    />
  );
}

const avatarGroupCountSize = {
  xs: "size-5",
  sm: "size-6",
  md: "size-7",
  lg: "size-8",
} as const;

function AvatarGroupCount({
  className,
  size = "md",
  ...props
}: ComponentProps<"div"> & {
  size?: keyof typeof avatarGroupCountSize;
}) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-background",
        avatarGroupCountSize[size],
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn("size-full object-cover", className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center rounded-[inherit] bg-inherit text-inherit", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
