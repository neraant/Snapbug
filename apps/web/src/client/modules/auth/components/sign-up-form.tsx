import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { useSignUpForm } from "@/client/modules/auth/hooks/use-sign-up-form";
import { useFindInvitationByToken } from "@/client/modules/shared/queries/use-find-invitation-by-token";

type SignUpFormProps = {
  invitationToken?: string;
};

type SignUpFormFieldsProps = {
  invitationToken?: string;
};

export function SignUpForm({ invitationToken }: SignUpFormProps) {
  if (invitationToken) {
    return <SignUpFormWithInvitation invitationToken={invitationToken} />;
  }

  return <SignUpFormFields />;
}

function SignUpFormFallback() {
  return <Skeleton className="h-64 w-full" />;
}

SignUpForm.Fallback = SignUpFormFallback;

type SignUpFormWithInvitationProps = {
  invitationToken: string;
};

function SignUpFormWithInvitation({ invitationToken }: SignUpFormWithInvitationProps) {
  const { data: invitation } = useFindInvitationByToken(invitationToken);

  return (
    <SignUpFormFields
      invitationToken={invitationToken}
      organizationName={invitation.organizationName}
      defaultEmail={invitation.email}
    />
  );
}

type SignUpFormFieldsInternalProps = SignUpFormFieldsProps & {
  defaultEmail?: string;
  organizationName?: string;
};

function SignUpFormFields({ invitationToken, defaultEmail = "", organizationName }: SignUpFormFieldsInternalProps) {
  const { control, hydrated, onSubmit, formState } = useSignUpForm({
    invitationToken,
    defaultEmail,
  });

  const invitationEmailLocked = organizationName != null;

  if (!hydrated) {
    return <SignUpFormFallback />;
  }

  return (
    <Column as="form" gap="none" width="full" onSubmit={onSubmit}>
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
          label={texts.field.signUpWorkEmail.label}
          placeholder={texts.field.signUpWorkEmail.placeholder}
          autoComplete="email"
          readOnly={invitationEmailLocked}
          description={organizationName ? texts.invitation.fieldHint(organizationName) : undefined}
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          autoComplete="new-password"
        />
        <SubmitButton loading={formState.isSubmitting} size="lg" className="w-full">
          {texts.signUp.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
