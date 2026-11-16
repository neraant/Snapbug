import { auth } from "@/auth";
import { InvitePage } from "@/client/modules/auth/components/invite-page";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function Page({ params }: PageProps) {
  const { token } = await params;
  const session = await auth();

  return (
    <InvitePage
      token={token}
      sessionEmail={session?.user?.email ?? undefined}
      isSignedIn={Boolean(session?.user?.id)}
    />
  );
}
