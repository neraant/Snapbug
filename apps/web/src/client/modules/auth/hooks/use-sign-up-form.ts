import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { signUpSchema, type SignUpSchemaType } from "@/client/modules/auth/schemas/sign-up.schema";
import { acceptInvitationAfterAuth } from "@/client/modules/auth/utils/accept-invitation-after-auth.util";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { useSignUp } from "@/client/modules/shared/queries/use-sign-up";
import { url } from "@/shared/build-url.util";

type UseSignUpFormInput = {
  invitationToken?: string;
  defaultEmail?: string;
};

export function useSignUpForm({ invitationToken, defaultEmail = "" }: UseSignUpFormInput) {
  const router = useRouter();
  const { mutateAsync: signUp } = useSignUp();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: defaultEmail, name: "", password: "" },
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
      return;
    }

    toast.add({
      title: texts.signUp.toast.success,
      type: "success",
    });

    await acceptInvitationAfterAuth(invitationToken, acceptInvitation);
    router.replace(url.overview());
  };

  return {
    ...form,
    hydrated,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
