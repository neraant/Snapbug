import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { toast } from "@workspace/design-system/components/ui/toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts";
import { signInSchema, type SignInSchemaType } from "@/client/modules/auth/schemas/sign-in.schema";
import { path } from "@/shared/path.const";

export function SignInForm() {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInSchemaType) => {
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      toast.add({
        title: texts.signIn.toast.invalidCredentials,
        type: "error",
      });
    } else {
      toast.add({
        title: texts.signIn.toast.success,
        type: "success",
      });
      router.replace(path.home);
    }
  };

  return (
    <Column as="form" gap="none" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.email.label}
          placeholder={texts.field.email.placeholder}
          className="h-10 text-base md:text-base"
          autoComplete="email"
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          className="h-10 text-base md:text-base"
          autoComplete="current-password"
        />
        <SubmitButton loading={formState.isSubmitting} size="lg" className="h-11 w-full text-base">
          {texts.signIn.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
