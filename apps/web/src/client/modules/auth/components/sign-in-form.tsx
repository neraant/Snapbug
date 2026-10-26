import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import Link from "next/link";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { useSignInForm } from "@/client/modules/auth/hooks/use-sign-in-form";
import { url } from "@/shared/build-url.util";

type SignInFormProps = {
  invitationToken?: string;
};

export function SignInForm({ invitationToken }: SignInFormProps) {
  const { control, onSubmit, formState } = useSignInForm({ invitationToken });

  return (
    <Column as="form" gap="none" width="full" onSubmit={onSubmit}>
      <FieldGroup>
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.workEmail.label}
          placeholder={texts.field.workEmail.placeholder}
          autoComplete="email"
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          autoComplete="current-password"
        />
        <Row justify="end" width="full">
          <Button nativeButton={false} variant="link" render={<Link href={url.forgotPassword()} />}>
            {texts.signIn.forgotPassword}
          </Button>
        </Row>
        <SubmitButton loading={formState.isSubmitting} size="lg" className="w-full">
          {texts.signIn.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
