import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { signInSchema, type SignInSchemaType } from "@/client/modules/auth/schemas/sign-in.schema";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { url } from "@/shared/build-url.util";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";

type UseInviteSignInInput = {
  token: string;
  email: string;
  organizationName: string;
};

export function useInviteSignIn({ token, email, organizationName }: UseInviteSignInInput) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email, password: "" },
  });

  const onSubmit = async ({ email: submittedEmail, password }: SignInSchemaType) => {
    const result = await signIn("credentials", {
      email: submittedEmail,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.add({ title: texts.signIn.toast.invalidCredentials, type: "error" });
      return;
    }

    try {
      const membership = await acceptInvitation({ token });
      await selectActiveOrganization(membership.organizationId);
      toast.add({ title: texts.invitePage.toast.joined(organizationName), type: "success" });
      router.replace(url.overview());
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.invitePage.toast.acceptError),
        type: "error",
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}