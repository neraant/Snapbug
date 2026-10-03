import { FieldDescription, FieldError, FieldLegend, FieldSet } from "@workspace/design-system/components/ui/field";
import { Label } from "@workspace/design-system/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@workspace/design-system/components/ui/radio-group";
import { cn } from "@workspace/design-system/lib/utils";
import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type RadioGroupFieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type RadioGroupFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  options: RadioGroupFieldOption[];
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
};

export function RadioGroupField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  orientation = "vertical",
  disabled,
}: RadioGroupFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">{label}</FieldLegend>
          {description && <FieldDescription>{description}</FieldDescription>}
          <RadioGroup
            name={field.name}
            value={field.value ?? null}
            onValueChange={field.onChange}
            disabled={disabled}
            className={cn(orientation === "horizontal" && "flex flex-row gap-4")}
          >
            {options.map((option) => {
              const id = `${field.name}-${option.value}`;

              return (
                <Label key={option.value} htmlFor={id}>
                  <RadioGroupItem
                    id={id}
                    value={option.value}
                    disabled={option.disabled}
                    aria-invalid={fieldState.invalid}
                  />
                  {option.label}
                </Label>
              );
            })}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
