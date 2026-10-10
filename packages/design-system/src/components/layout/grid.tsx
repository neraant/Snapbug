import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

const gridVariants = cva("grid w-full min-w-0", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
    },
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      "fluid-sm": "grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]",
      "fluid-md": "grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
      "fluid-lg": "grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]",
      "responsive-2": "grid-cols-1 sm:grid-cols-2",
      "responsive-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      "responsive-4": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    },
  },
  defaultVariants: {
    gap: "lg",
    columns: "fluid-lg",
  },
});

type PolymorphicProps<T extends ElementType, OwnProps> = PropsWithChildren<OwnProps & { as?: T }> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | "as" | "children">;

type GridOwnProps = VariantProps<typeof gridVariants> & {
  className?: string;
};

type GridProps<T extends ElementType = "div"> = PolymorphicProps<T, GridOwnProps>;

export function Grid<T extends ElementType = "div">({ as, gap, columns, className, children, ...props }: GridProps<T>) {
  const Tag = (as || "div") as ElementType;

  return (
    <Tag className={cn(gridVariants({ gap, columns }), className)} {...props}>
      {children}
    </Tag>
  );
}
