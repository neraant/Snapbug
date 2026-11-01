import { auth } from "@/auth";
import { AcceptSignedInInvitation } from "@/client/modules/auth/components/accept-signed-in-invitation";
import { SignInContent } from "@/client/modules/auth/components/sign-in-content";
import { readInvitationSearchParam } from "@/shared/utils/parse-invitation-token.util";

type PageProps = {
  searchParams: Promise<{ invitation?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const invitationToken = readInvitationSearchParam((await searchParams).invitation);
  const session = await auth();

  if (session?.user?.id && invitationToken) {
    return <AcceptSignedInInvitation invitationToken={invitationToken} />;
  }

  return <SignInContent invitationToken={invitationToken} />;
}
