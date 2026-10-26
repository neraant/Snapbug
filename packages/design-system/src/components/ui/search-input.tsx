import { Input as InputPrimitive } from "@base-ui/react/input";
import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { SearchIcon, XIcon } from "lucide-react";
import { type ChangeEvent, type ComponentProps } from "react";

const searchInputVariants = cva(
  "flex min-w-0 items-center border border-input bg-card text-foreground transition-colors outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-input/50 has-[:disabled]:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-[color-mix(in_oklch,var(--card)_75%,var(--background))] dark:has-[:disabled]:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "h-8 gap-1.5 rounded-lg px-2.5 text-sm",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs",
      },
      width: {
        full: "w-full",
        sm: "w-full max-w-sm min-w-xs flex-1",
      },
    },
    defaultVariants: {
      size: "default",
      width: "full",
    },
  },
);

const searchInputIconVariants = cva("pointer-events-none shrink-0 text-muted-foreground", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type SearchInputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof searchInputVariants> & {
    clearLabel?: string;
  };

function SearchInput({
  className,
  size = "default",
  width = "full",
  clearLabel,
  value,
  disabled,
  onChange,
  "aria-invalid": ariaInvalid,
  type = "search",
  ...props
}: SearchInputProps) {
  const text = typeof value === "string" ? value : "";
  const showClear = Boolean(clearLabel) && text.length > 0;

  const clear = () => {
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      data-slot="search-input"
      data-size={size}
      aria-invalid={ariaInvalid ? true : undefined}
      className={cn(searchInputVariants({ size, width }), className)}
    >
      <SearchIcon aria-hidden className={searchInputIconVariants({ size })} />
      <InputPrimitive
        type={type}
        value={value}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        onChange={onChange}
        className="h-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        {...props}
      />
      {showClear ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-5 text-muted-foreground hover:text-foreground"
          aria-label={clearLabel}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={clear}
        >
          <XIcon aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}

export { SearchInput, searchInputVariants };
