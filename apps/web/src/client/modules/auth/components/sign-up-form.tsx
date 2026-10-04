import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts";
import { signUpSchema, type SignUpSchemaType } from "@/client/modules/auth/schemas/sign-up.schema";
import { useSignUp } from "@/client/shared/queries/use-sign-up";
import { path } from "@/shared/path.const";

export function SignUpForm() {
  const router = useRouter();
  const { mutateAsync: signUp } = useSignUp();
  const { control, handleSubmit, formState } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", name: "", password: "" },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    try {
      await signUp(values);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.signUp.toast.genericError),
        type: "error",
      });
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.add({
        title: texts.signUp.toast.signInAfterSignUpFailed,
        type: "error",
      });
    } else {
      toast.add({
        title: texts.signUp.toast.success,
        type: "success",
      });
      router.replace(path.home);
    }
  };

  return (
    <Column as="form" gap="none" width="full" onSubmit={handleSubmit(onSubmit)}>
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
