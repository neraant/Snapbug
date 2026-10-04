import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { cn } from "@workspace/design-system/lib/utils";
import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
} & Omit<ComponentProps<typeof Input>, "name" | "type">;

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...inputProps
}: PasswordFieldProps<TFieldValues>) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Row justify="between" className="h-5.5">
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            {fieldState.invalid && (
              <Badge variant="destructive">
                <InfoIcon />
                {fieldState.error?.message}
              </Badge>
            )}
          </Row>
          <div className="relative">
            <Input
              {...field}
              {...inputProps}
              id={field.name}
              type={visible ? "text" : "password"}
              aria-invalid={fieldState.invalid}
              className={cn("pr-8", className)}
            />
            <Button
              onClick={() => setVisible((prev) => !prev)}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              tabIndex={-1}
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 h-full w-8 rounded-none bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground focus-visible:text-foreground active:translate-y-0 dark:hover:bg-transparent"
            >
              {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </Button>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
