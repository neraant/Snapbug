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

type UseInviteSignUpInput = {
  token: string;
  email: string;
  organizationName: string;
};

export function useInviteSignUp({ token, email, organizationName }: UseInviteSignUpInput) {
  const router = useRouter();
  const { mutateAsync: signUp } = useSignUp();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email, name: "", password: "", acceptedTerms: false },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    try {
      await signUp({
        email: values.email,
        name: values.name,
        password: values.password,
        acceptedTerms: true,
      });
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
      toast.add({ title: texts.signUp.toast.signInAfterSignUpFailed, type: "error" });
      return;
    }

    router.refresh();
    const accepted = await acceptInvitationAfterAuth(token, acceptInvitation);
    if (!accepted) {
      return;
    }

    toast.add({ title: texts.invitePage.toast.joined(organizationName), type: "success" });
    router.replace(url.overview());
  };

  return {
    ...form,
    hydrated,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
