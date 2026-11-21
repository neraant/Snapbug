import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { signInSchema, type SignInSchemaType } from "@/client/modules/auth/schemas/sign-in.schema";
import {
  acceptInvitationAfterAuth,
  waitForAuthenticatedSession,
} from "@/client/modules/auth/utils/accept-invitation-after-auth.util";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { url } from "@/shared/build-url.util";

type UseInviteSignInInput = {
  token: string;
  email: string;
  organizationName: string;
};

export function useInviteSignIn({ token, email, organizationName }: UseInviteSignInInput) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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

    const sessionReady = await waitForAuthenticatedSession();
    if (!sessionReady) {
      toast.add({ title: texts.invitePage.toast.sessionWaitTimedOut, type: "error" });
      return;
    }

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
