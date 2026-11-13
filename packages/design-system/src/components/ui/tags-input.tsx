"use client";

import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import { XIcon } from "lucide-react";
import { type ComponentProps, type KeyboardEvent, useState } from "react";

type TagsInputProps = Omit<ComponentProps<"div">, "onChange" | "value"> & {
  id?: string;
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
  removeTagLabel?: (tag: string) => string;
};

function TagsInput({
  id,
  value,
  onValueChange,
  placeholder,
  className,
  removeTagLabel = (tag) => `Remove ${tag}`,
  disabled = false,
  "aria-invalid": ariaInvalid,
  ...props
}: TagsInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    if (disabled) return;

    const tag = raw.trim();
    if (!tag || value.includes(tag)) {
      setDraft("");
      return;
    }
    onValueChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onValueChange(value.filter((entry) => entry !== tag));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === "Backspace" && draft.length === 0 && value.length > 0) {
      removeTag(value[value.length - 1]!);
    }
  };

  return (
    <div
      data-slot="tags-input"
      aria-invalid={ariaInvalid}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex min-h-10 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-[color-mix(in_oklch,var(--card)_75%,var(--background))] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className={disabled ? undefined : "gap-0.5 pr-0.5"}>
          {tag}
          {disabled ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5 text-muted-foreground hover:text-foreground"
              aria-label={removeTagLabel(tag)}
              onClick={() => removeTag(tag)}
            >
              <XIcon aria-hidden />
            </Button>
          )}
        </Badge>
      ))}
      <Row as="span" minWidth="0" width="full" className="min-w-[8rem] flex-1">
        <input
          id={id}
          value={draft}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="h-7 w-full min-w-0 border-0 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
        />
      </Row>
    </div>
  );
}

export { TagsInput };
