import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { InfoIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  inputId?: string;
} & Omit<ComponentProps<typeof Input>, "name" | "id">;

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  inputId,
  ...inputProps
}: TextFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const id = inputId ?? String(field.name);

        return (
          <Field data-invalid={fieldState.invalid}>
            <Row justify="between" className="h-5.5">
              <FieldLabel htmlFor={id}>{label}</FieldLabel>

              {fieldState.invalid && (
                <Badge variant="destructive">
                  <InfoIcon />
                  {fieldState.error?.message}
                </Badge>
              )}
            </Row>
            <Input {...field} {...inputProps} id={id} aria-invalid={fieldState.invalid} />
            {description && <FieldDescription>{description}</FieldDescription>}
          </Field>
        );
      }}
    />
  );
}
