import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { ColorSwatchButton } from "@workspace/design-system/components/ui/color-swatch-button";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { InfoIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type ColorFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  colors: readonly string[];
  swatchLabel: (color: string) => string;
};

export function ColorField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  colors,
  swatchLabel,
}: ColorFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Row justify="between" className="h-5.5">
            <FieldLabel>{label}</FieldLabel>
            {fieldState.invalid ? (
              <Badge variant="destructive">
                <InfoIcon />
                {fieldState.error?.message}
              </Badge>
            ) : null}
          </Row>
          <Row gap="sm">
            {colors.map((color) => (
              <ColorSwatchButton
                key={color}
                color={color}
                selected={field.value === color}
                label={swatchLabel(color)}
                onClick={() => field.onChange(color)}
              />
            ))}
          </Row>
        </Field>
      )}
    />
  );
}
