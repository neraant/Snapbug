import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

const rowVariants = cva("flex flex-row", {
  variants: {
    gap: {
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
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
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
  },
  defaultVariants: {
    gap: "md",
    align: "center",
    justify: "start",
    wrap: true,
  },
});

type PolymorphicProps<T extends ElementType, OwnProps> = PropsWithChildren<OwnProps & { as?: T }> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | "as" | "children">;

type RowOwnProps = VariantProps<typeof rowVariants> & {
  className?: string;
};

type RowProps<T extends ElementType = "div"> = PolymorphicProps<T, RowOwnProps>;

export function Row<T extends ElementType = "div">({
  as,
  gap,
  align,
  justify,
  wrap,
  minWidth,
  width,
  className,
  children,
  ...props
}: RowProps<T>) {
  const Tag = (as || "div") as ElementType;

  return (
    <Tag className={cn(rowVariants({ gap, align, justify, wrap, minWidth, width }), className)} {...props}>
      {children}
    </Tag>
  );
}
