import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, PropsWithChildren } from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      "heading-lg": "text-3xl font-bold tracking-tight",
      "heading-md": "text-2xl font-semibold tracking-tight",
      "heading-sm": "text-xl font-semibold",
      "heading-xs": "text-base leading-tight font-semibold",
      "text-lg": "text-lg font-normal",
      "text-md": "text-base font-normal",
      "text-sm": "text-sm font-normal",
      "text-xs": "text-xs font-normal",
      label: "text-sm font-medium",
    },
    color: {
      default: "text-foreground",
      inherit: "text-inherit",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    font: {
      sans: "font-sans",
      heading: "font-heading",
      mono: "font-mono",
    },
  },
  defaultVariants: {
    variant: "text-md",
    align: "left",
  },
});

export const typographyFonts = ["sans", "heading", "mono"] as const;

export type TypographyFont = (typeof typographyFonts)[number];

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>;

const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  "heading-lg": "h1",
  "heading-md": "h2",
  "heading-sm": "h3",
  "heading-xs": "h4",
  "text-lg": "p",
  "text-md": "p",
  "text-sm": "p",
  "text-xs": "p",
  label: "label",
};

type TypographyProps = PropsWithChildren<{
  variant?: TypographyVariant;
  color?: "default" | "inherit" | "destructive" | "muted" | "primary";
  align?: "left" | "center" | "right";
  weight?: NonNullable<VariantProps<typeof typographyVariants>["weight"]>;
  font?: TypographyFont;
  truncate?: boolean;
  className?: string;
  as?: ElementType;
}>;

export function Typography({
  variant = "text-md",
  color = "default",
  align = "left",
  weight,
  font,
  truncate = false,
  className,
  as,
  children,
}: TypographyProps) {
  const Tag = as || DEFAULT_TAG[variant];

  return (
    <Tag
      className={cn(
        typographyVariants({ variant, color, align, weight, font }),
        truncate && "min-w-0 truncate",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
