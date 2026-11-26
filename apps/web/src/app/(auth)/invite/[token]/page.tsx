"use client";

import { use } from "react";

import { InvitePage } from "@/client/modules/auth/components/invite-page";
import { useAuthSession } from "@/client/modules/auth/hooks/use-auth-session";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default function Page({ params }: PageProps) {
  const { token } = use(params);
  const session = useAuthSession();

  return <InvitePage token={token} sessionEmail={session.email} isSignedIn={session.isSignedIn} />;
}
