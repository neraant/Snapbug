import { Field, FieldDescription, FieldError, FieldLabel } from "@workspace/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type SelectFieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type SelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  placeholder?: string;
  options: SelectFieldOption[];
  disabled?: boolean;
};

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  disabled,
}: SelectFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Select name={field.name} value={field.value ?? null} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger id={field.name} onBlur={field.onBlur} aria-invalid={fieldState.invalid} className="w-full">
              <SelectValue placeholder={placeholder}>
                {(value) => {
                  if (value == null || value === "") {
                    return null;
                  }

                  const selected = options.find((option) => option.value === value);

                  return selected?.label ?? value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
