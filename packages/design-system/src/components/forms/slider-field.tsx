import { Row } from "@workspace/design-system/components/layout/row";
import { Field, FieldDescription, FieldError, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Slider } from "@workspace/design-system/components/ui/slider";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type SliderFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
} & Omit<ComponentProps<typeof Slider>, "name" | "value" | "defaultValue" | "onValueChange" | "onValueCommitted">;

export function SliderField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  min = 0,
  max = 100,
  ...sliderProps
}: SliderFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = typeof field.value === "number" ? field.value : min;

        return (
          <Field data-invalid={fieldState.invalid}>
            <Row justify="between" className="w-full">
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              <Typography variant="text-sm" color="muted">
                {value}
              </Typography>
            </Row>
            <Slider
              {...sliderProps}
              id={field.name}
              name={field.name}
              min={min}
              max={max}
              value={[value]}
              onValueChange={(next) => {
                field.onChange(Array.isArray(next) ? (next[0] ?? min) : next);
              }}
              onValueCommitted={() => {
                field.onBlur();
              }}
              aria-invalid={fieldState.invalid}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
