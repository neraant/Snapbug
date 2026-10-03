import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { PlusIcon, XIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

function normalizeChipValue(value: string) {
  return value.trim();
}

function isSameChip(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

type ChipsFieldContentProps = {
  label: string;
  description?: string;
  suggestions: readonly string[];
  addPlaceholder?: string;
  selectPlaceholder?: string;
  selected: string[];
  invalid?: boolean;
  onChange: (next: string[]) => void;
};

function ChipsFieldContent({
  label,
  description,
  suggestions,
  addPlaceholder = "Add your own",
  selectPlaceholder = "Select from list",
  selected,
  invalid,
  onChange,
}: ChipsFieldContentProps) {
  const addInputId = useId();
  const selectId = useId();
  const [draft, setDraft] = useState("");
  const [pickerValue, setPickerValue] = useState<string | null>(null);
  const [customOptions, setCustomOptions] = useState<string[]>(() =>
    selected.filter((item) => !suggestions.some((suggestion) => isSameChip(suggestion, item))),
  );

  const optionPool = useMemo(() => {
    const merged = [...suggestions, ...customOptions];
    const unique: string[] = [];

    for (const item of merged) {
      if (!unique.some((existing) => isSameChip(existing, item))) {
        unique.push(item);
      }
    }

    return unique;
  }, [customOptions, suggestions]);

  const dropdownOptions = optionPool.filter((item) => !selected.some((value) => isSameChip(value, item)));

  const add = (value: string) => {
    const normalized = normalizeChipValue(value);
    if (!normalized) {
      return;
    }

    const exists = selected.some((item) => isSameChip(item, normalized));
    if (exists) {
      return;
    }

    if (!suggestions.some((suggestion) => isSameChip(suggestion, normalized))) {
      setCustomOptions((prev) => (prev.some((item) => isSameChip(item, normalized)) ? prev : [...prev, normalized]));
    }

    onChange([...selected, normalized]);
  };

  const remove = (value: string) => {
    onChange(selected.filter((item) => !isSameChip(item, value)));
  };

  const addCustom = () => {
    add(draft);
    setDraft("");
  };

  return (
    <FieldSet data-invalid={invalid}>
      <FieldLegend variant="label">{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <Field data-invalid={invalid}>
        <Select
          name={selectId}
          value={pickerValue}
          onValueChange={(value) => {
            if (value != null && value !== "") {
              add(value);
            }
            setPickerValue(null);
          }}
          disabled={dropdownOptions.length === 0}
        >
          <SelectTrigger id={selectId} aria-invalid={invalid} className="w-full">
            <SelectValue placeholder={dropdownOptions.length === 0 ? "No more options" : selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {dropdownOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field data-invalid={invalid}>
        <Row gap="sm" wrap={false} className="w-full">
          <Input
            id={addInputId}
            value={draft}
            placeholder={addPlaceholder}
            aria-invalid={invalid}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
          />
          <Button variant="secondary" size="icon" aria-label="Add item" onClick={addCustom}>
            <PlusIcon />
          </Button>
        </Row>
      </Field>
      {selected.length > 0 && (
        <Row gap="sm" wrap className="w-full">
          {selected.map((item) => (
            <Button
              key={item}
              size="sm"
              variant="secondary"
              className="h-auto min-h-7 gap-1 px-2.5 py-1"
              onClick={() => remove(item)}
            >
              {item}
              <XIcon className="size-3.5 opacity-70" />
            </Button>
          ))}
        </Row>
      )}
    </FieldSet>
  );
}

type ChipsFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  suggestions: readonly string[];
  addPlaceholder?: string;
  selectPlaceholder?: string;
};

export function ChipsField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  suggestions,
  addPlaceholder,
  selectPlaceholder,
}: ChipsFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <ChipsFieldContent
            label={label}
            description={description}
            suggestions={suggestions}
            addPlaceholder={addPlaceholder}
            selectPlaceholder={selectPlaceholder}
            selected={Array.isArray(field.value) ? field.value : []}
            invalid={fieldState.invalid}
            onChange={field.onChange}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </>
      )}
    />
  );
}
