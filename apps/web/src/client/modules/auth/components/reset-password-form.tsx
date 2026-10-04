import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "@/client/modules/auth/schemas/reset-password.schema";
import { useResetPassword } from "@/client/shared/queries/use-reset-password";
import { path } from "@/shared/path.const";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { mutateAsync: resetPassword } = useResetPassword();
  const { control, handleSubmit, formState } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password }: ResetPasswordSchemaType) => {
    let email: string;

    try {
      ({ email } = await resetPassword({ token, password }));
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.resetPassword.toast.genericError),
        type: "error",
      });
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.add({
        title: texts.resetPassword.toast.signInFailed,
        type: "error",
      });
      router.replace(path.signIn);
      return;
    }

    toast.add({
      title: texts.resetPassword.toast.success,
      type: "success",
    });
    router.replace(path.home);
  };

  return (
    <Column as="form" gap="none" width="full" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <PasswordField
          control={control}
          name="password"
          label={texts.resetPassword.newPassword.label}
          placeholder={texts.resetPassword.newPassword.placeholder}
          autoComplete="new-password"
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label={texts.resetPassword.confirmPassword.label}
          placeholder={texts.resetPassword.confirmPassword.placeholder}
          autoComplete="new-password"
        />
        <SubmitButton loading={formState.isSubmitting} disabled={!formState.isValid} size="lg" className="mt-2 w-full">
          {texts.resetPassword.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
