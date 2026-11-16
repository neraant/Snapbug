import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignUpContent } from "@/client/modules/auth/components/sign-up-content";
import { url } from "@/shared/build-url.util";
import { readInvitationSearchParam } from "@/shared/utils/parse-invitation-token.util";

type PageProps = {
  searchParams: Promise<{ invitation?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const invitationToken = readInvitationSearchParam((await searchParams).invitation);
  if (invitationToken) {
    redirect(url.invite(invitationToken));
  }

  const session = await auth();
  if (session?.user?.id) {
    redirect(url.overview());
  }

  return <SignUpContent />;
}