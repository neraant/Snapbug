import { CheckboxField } from "@workspace/design-system/components/forms/checkbox-field";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";

import { SignupAboutField } from "@/client/modules/signup/components/signup-about-field";
import { texts } from "@/client/modules/signup/consts/texts.const";
import { useSignupForm } from "@/client/modules/signup/hooks/use-signup-form";
import type { SignupUserType } from "@/shared/signup/signup.schema";

type SignupFormProps = {
  onSignedUp: (user: SignupUserType) => void;
};

export function SignupForm({ onSignedUp }: SignupFormProps) {
  const { control, onSubmit, formState } = useSignupForm({ onSignedUp });

  return (
    <Column as="form" noValidate gap="none" width="full" onSubmit={onSubmit}>
      <FieldGroup>
        <TextField
          control={control}
          name="name"
          type="text"
          label={texts.field.name.label}
          placeholder={texts.field.name.placeholder}
          autoComplete="name"
        />
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.email.label}
          placeholder={texts.field.email.placeholder}
          autoComplete="email"
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          description={texts.field.password.hint}
          autoComplete="new-password"
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label={texts.field.confirmPassword.label}
          placeholder={texts.field.confirmPassword.placeholder}
          autoComplete="new-password"
        />
        <TextField control={control} name="birthDate" type="date" label={texts.field.birthDate.label} />
        <SignupAboutField control={control} />
        <CheckboxField control={control} name="consent" label={texts.field.consent.label} />
        <SubmitButton size="lg" className="w-full">
          {formState.isSubmitting ? texts.signup.submitting : texts.signup.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
