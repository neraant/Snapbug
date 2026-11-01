import { Popover, PopoverContent, PopoverTrigger } from "@workspace/design-system/components/ui/popover";
import { selectTriggerVariants } from "@workspace/design-system/components/ui/select";
import { cn } from "@workspace/design-system/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";

type TicketBoardOptionFilterOption<T extends string> = {
  value: T;
  label: string;
  leading?: ReactNode;
};

type TicketBoardOptionFilterProps<T extends string> = {
  ariaLabel: string;
  placeholder: string;
  value: T[];
  options: TicketBoardOptionFilterOption<T>[];
  onValueChange: (value: T[]) => void;
};

export function TicketBoardOptionFilter<T extends string>({
  ariaLabel,
  placeholder,
  value,
  options,
  onValueChange,
}: TicketBoardOptionFilterProps<T>) {
  const selected = useMemo(() => new Set(value), [value]);
  const summary = options
    .filter((option) => selected.has(option.value))
    .map((option) => option.label)
    .join(", ");

  const toggle = (optionValue: T) => {
    const next = new Set(selected);
    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }
    onValueChange(options.map((option) => option.value).filter((entry) => next.has(entry)));
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={ariaLabel}
        data-placeholder={value.length === 0 ? "" : undefined}
        className={cn(selectTriggerVariants({ variant: "default", size: "default" }), "w-40")}
      >
        <span className="line-clamp-1 flex flex-1 text-left">{value.length === 0 ? placeholder : summary}</span>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-max min-w-(--anchor-width) gap-0 p-1">
        {options.map((option) => {
          const checked = selected.has(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => toggle(option.value)}
            >
              {option.leading}
              <span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">{option.label}</span>
              {checked ? <CheckIcon className="pointer-events-none absolute right-2 size-4" /> : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
