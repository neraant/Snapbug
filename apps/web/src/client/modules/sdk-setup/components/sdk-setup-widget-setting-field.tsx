import { Row } from "@workspace/design-system/components/layout/row";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import type { ReactNode } from "react";

type SdkSetupWidgetSettingFieldProps = {
  label: string;
  description?: string;
  htmlFor?: string;
  invalid?: boolean;
  orientation?: "horizontal" | "vertical";
  labelAccessory?: ReactNode;
  control: ReactNode;
};

export function SdkSetupWidgetSettingField({
  label,
  description,
  htmlFor,
  invalid,
  orientation = "vertical",
  labelAccessory,
  control,
}: SdkSetupWidgetSettingFieldProps) {
  if (orientation === "horizontal") {
    return (
      <Field orientation="horizontal" data-invalid={invalid}>
        <FieldContent>
          <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
          {description ? <FieldDescription>{description}</FieldDescription> : null}
        </FieldContent>
        {control}
      </Field>
    );
  }

  return (
    <Field data-invalid={invalid}>
      {labelAccessory ? (
        <Row justify="between" className="h-5.5">
          <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
          {labelAccessory}
        </Row>
      ) : (
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      )}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {control}
    </Field>
  );
}
