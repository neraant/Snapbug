import { Column } from "@workspace/design-system/components/layout/column";
import { Card } from "@workspace/design-system/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Textarea } from "@workspace/design-system/components/ui/textarea";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { type Control, Controller } from "react-hook-form";

import { SignupMarkdown } from "@/client/modules/signup/components/signup-markdown";
import { texts } from "@/client/modules/signup/consts/texts.const";
import type { SignupFormSchemaType } from "@/client/modules/signup/schemas/signup-form.schema";
import { ABOUT_MAX_LENGTH } from "@/shared/signup/signup.const";

type SignupAboutFieldProps = {
  control: Control<SignupFormSchemaType>;
};

export function SignupAboutField({ control }: SignupAboutFieldProps) {
  return (
    <Controller
      name="about"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{texts.field.about.label}</FieldLabel>
          <Textarea
            key={Math.floor(field.value.length / 50)}
            {...field}
            id={field.name}
            placeholder={texts.field.about.placeholder}
            aria-invalid={fieldState.invalid}
          />
          <FieldDescription>
            {field.value.length}/{ABOUT_MAX_LENGTH}
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          <Card gap="xs">
            <Typography variant="text-xs" color="muted">
              {texts.field.about.preview}
            </Typography>
            <Column gap="none">
              <SignupMarkdown source={field.value} />
            </Column>
          </Card>
        </Field>
      )}
    />
  );
}
