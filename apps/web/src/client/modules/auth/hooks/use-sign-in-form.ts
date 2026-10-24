import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { signInSchema, type SignInSchemaType } from "@/client/modules/auth/schemas/sign-in.schema";
import { acceptInvitationAfterAuth } from "@/client/modules/auth/utils/accept-invitation-after-auth.util";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { path } from "@/shared/path.const";

type UseSignInFormInput = {
  invitationToken?: string;
};

export function useSignInForm({ invitationToken }: UseSignInFormInput) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const form = useForm<SignInSchemaType>({
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
      return;
    }

    toast.add({
      title: texts.signIn.toast.success,
      type: "success",
    });

    await acceptInvitationAfterAuth(invitationToken, acceptInvitation);
    router.replace(path.overview);
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
