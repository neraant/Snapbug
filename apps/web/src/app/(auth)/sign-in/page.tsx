"use client";

import { redirect } from "next/navigation";
import { use } from "react";

import { SignInContent } from "@/client/modules/auth/components/sign-in-content";
import { useAuthSession } from "@/client/modules/auth/hooks/use-auth-session";
import { url } from "@/shared/build-url.util";
import { readInvitationSearchParam } from "@/shared/utils/parse-invitation-token.util";

type PageProps = {
  searchParams: Promise<{ invitation?: string | string[] }>;
};

export default function Page({ searchParams }: PageProps) {
  const invitationToken = readInvitationSearchParam(use(searchParams).invitation);
  const session = useAuthSession();

  if (invitationToken) {
    redirect(url.invite(invitationToken));
  }

  if (session.isSignedIn) {
    redirect(url.overview());
  }

  return <SignInContent />;
}
