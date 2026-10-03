import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

const columnVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    minWidth: {
      "0": "min-w-0",
      sm: "min-w-40",
      md: "min-w-60",
    },
    width: {
      full: "w-full",
      sm: "w-full max-w-sm",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start",
  },
});

type PolymorphicProps<T extends ElementType, OwnProps> = PropsWithChildren<OwnProps & { as?: T }> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | "as" | "children">;

type ColumnOwnProps = VariantProps<typeof columnVariants> & {
  className?: string;
};

type ColumnProps<T extends ElementType = "div"> = PolymorphicProps<T, ColumnOwnProps>;

export function Column<T extends ElementType = "div">({
  as,
  gap,
  align,
  justify,
  minWidth,
  width,
  padding,
  className,
  children,
  ...props
}: ColumnProps<T>) {
  const Tag = (as || "div") as ElementType;

  return (
    <Tag className={cn(columnVariants({ gap, align, justify, minWidth, width, padding }), className)} {...props}>
      {children}
    </Tag>
  );
}
