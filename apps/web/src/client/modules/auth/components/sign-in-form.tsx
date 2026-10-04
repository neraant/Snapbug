import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { toast } from "@workspace/design-system/components/ui/toast";
import Link from "next/link";
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

  const onSubmit = async ({ email, password }: SignInSchemaType) => {
    const result = await signIn("credentials", {
      email,
      password,
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
    <Column as="form" gap="none" width="full" onSubmit={handleSubmit(onSubmit)}>
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
          <Button nativeButton={false} variant="link" render={<Link href={path.forgotPassword} />}>
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
