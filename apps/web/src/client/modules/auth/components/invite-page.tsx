"use client";

import { CheckboxField } from "@workspace/design-system/components/forms/checkbox-field";
import { PasswordField } from "@workspace/design-system/components/forms/password-field";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { FindInvitationByTokenOutputDtoType } from "@workspace/validation/modules/invitation/dto/find-invitation-by-token.schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Suspense, useEffect } from "react";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { useInviteAccept } from "@/client/modules/auth/hooks/use-invite-accept";
import { useInviteSignIn } from "@/client/modules/auth/hooks/use-invite-sign-in";
import { useInviteSignUp } from "@/client/modules/auth/hooks/use-invite-sign-up";
import { invitationDaysUntilExpiry } from "@/client/modules/auth/utils/invitation-expiry-label.util";
import { useAcceptInvitation } from "@/client/modules/shared/queries/use-accept-invitation";
import { useFindInvitationByToken } from "@/client/modules/shared/queries/use-find-invitation-by-token";
import { url } from "@/shared/build-url.util";
import { selectActiveOrganization } from "@/shared/organization/select-active-organization";
import { parseInvitationToken } from "@/shared/utils/parse-invitation-token.util";

type InvitePageProps = {
  token: string;
  sessionEmail?: string;
  isSignedIn: boolean;
};

export function InvitePage({ token, sessionEmail, isSignedIn }: InvitePageProps) {
  const parsedToken = parseInvitationToken(token);

  if (!parsedToken) {
    return <InviteInvalidState />;
  }

  return (
    <Suspense fallback={<InvitePageFallback />}>
      <InvitePageContent token={parsedToken} sessionEmail={sessionEmail} isSignedIn={isSignedIn} />
    </Suspense>
  );
}

type InvitePageContentProps = {
  token: string;
  sessionEmail?: string;
  isSignedIn: boolean;
};

function InvitePageContent({ token, sessionEmail, isSignedIn }: InvitePageContentProps) {
  const { data: invitation } = useFindInvitationByToken(token);

  if (invitation.status === "invalid" || invitation.status === "revoked" || invitation.status === "accepted") {
    return <InviteInvalidState />;
  }

  if (invitation.status === "expired") {
    return <InviteExpiredState invitation={invitation} />;
  }

  return (
    <InvitePendingState token={token} invitation={invitation} sessionEmail={sessionEmail} isSignedIn={isSignedIn} />
  );
}

function InvitePageFallback() {
  return <Skeleton className="h-80 w-full" />;
}

function InviteInvalidState() {
  return (
    <Column width="full" gap="md">
      <Typography variant="heading-lg">{texts.invitePage.invalidTitle}</Typography>
      <Typography variant="text-md" color="muted">
        {texts.invitePage.invalidDescription}
      </Typography>
      <Button nativeButton={false} variant="link" render={<Link href={url.signIn()} />}>
        {texts.invitePage.signInLink}
      </Button>
    </Column>
  );
}

function InviteExpiredState({
  invitation,
}: {
  invitation: Extract<FindInvitationByTokenOutputDtoType, { status: "expired" }>;
}) {
  return (
    <Column width="full" gap="md">
      <Typography variant="heading-lg">{texts.invitePage.expiredTitle}</Typography>
      <Typography variant="text-md" color="muted">
        {texts.invitePage.expiredDescription(invitation.organizationName, invitation.inviterName)}
      </Typography>
    </Column>
  );
}

type InvitePendingStateProps = {
  token: string;
  invitation: Extract<FindInvitationByTokenOutputDtoType, { status: "pending" }>;
  sessionEmail?: string;
  isSignedIn: boolean;
};

function InvitePendingState({ token, invitation, sessionEmail, isSignedIn }: InvitePendingStateProps) {
  const signedInEmail = sessionEmail?.toLowerCase();
  const invitedEmail = invitation.email.toLowerCase();
  const emailsMatch = signedInEmail === invitedEmail;
  const wrongAccount = isSignedIn && signedInEmail !== undefined && !emailsMatch;

  return (
    <Column width="full" gap="lg">
      <InviteSummaryCard invitation={invitation} />
      {wrongAccount && sessionEmail ? (
        <InviteWrongAccountActions sessionEmail={sessionEmail} invitedEmail={invitation.email} />
      ) : invitation.alreadyMember && emailsMatch ? (
        <InviteAlreadyMemberActions
          token={token}
          organizationId={invitation.organizationId}
          organizationName={invitation.organizationName}
        />
      ) : isSignedIn && emailsMatch ? (
        <InviteJoinActions token={token} organizationName={invitation.organizationName} />
      ) : invitation.accountExists ? (
        <InviteSignInForm token={token} invitation={invitation} />
      ) : (
        <InviteSignUpForm token={token} invitation={invitation} />
      )}
    </Column>
  );
}

function InviteSummaryCard({
  invitation,
}: {
  invitation: Extract<FindInvitationByTokenOutputDtoType, { status: "pending" }>;
}) {
  const days = invitationDaysUntilExpiry(invitation.expiresAt);

  return (
    <Card className="w-full">
      <Card.Header>
        <Column width="full" gap="xs">
          <Typography variant="heading-xs">
            {texts.invitePage.cardTitle(invitation.inviterName, invitation.organizationName)}
          </Typography>
          <Row gap="sm" wrap>
            <Badge variant="secondary">{texts.invitePage.roleLabel(invitation.role)}</Badge>
            <Typography variant="text-sm" color="muted">
              {texts.invitePage.expiresIn(days)}
            </Typography>
          </Row>
        </Column>
      </Card.Header>
      <Card.Content>
        <Typography variant="text-sm">{texts.invitePage.invitedEmail(invitation.email)}</Typography>
      </Card.Content>
    </Card>
  );
}

function InviteAlreadyMemberActions({
  token,
  organizationId,
  organizationName,
}: {
  token: string;
  organizationId: string;
  organizationName: string;
}) {
  const router = useRouter();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();

  useEffect(() => {
    void acceptInvitation({ token }).catch(() => undefined);
  }, [acceptInvitation, token]);

  const openOrganization = async () => {
    await selectActiveOrganization(organizationId);
    router.replace(url.overview());
  };

  return (
    <Column width="full" gap="md">
      <Typography variant="text-md">{texts.invitePage.alreadyMemberTitle(organizationName)}</Typography>
      <Button size="lg" className="w-full" onClick={() => void openOrganization()}>
        {texts.invitePage.openOrganization(organizationName)}
      </Button>
    </Column>
  );
}

function InviteWrongAccountActions({ sessionEmail, invitedEmail }: { sessionEmail: string; invitedEmail: string }) {
  const router = useRouter();

  const signOutAndContinue = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <Column width="full" gap="md">
      <Typography variant="heading-xs">{texts.invitePage.wrongAccountTitle}</Typography>
      <Typography variant="text-md" color="muted">
        {texts.invitePage.wrongAccountDescription(sessionEmail, invitedEmail)}
      </Typography>
      <Button size="lg" className="w-full" onClick={() => void signOutAndContinue()}>
        {texts.invitePage.signOutAndContinue(invitedEmail)}
      </Button>
      <Button nativeButton={false} variant="link" render={<Link href={url.overview()} />}>
        {texts.invitePage.goToApp}
      </Button>
    </Column>
  );
}

function InviteJoinActions({ token, organizationName }: { token: string; organizationName: string }) {
  const { accept, isPending } = useInviteAccept({ token, organizationName });

  return (
    <Column width="full" gap="sm">
      <SubmitButton size="lg" className="w-full" loading={isPending} onClick={() => void accept()}>
        {texts.invitePage.joinOrganization(organizationName)}
      </SubmitButton>
      <Button
        variant="link"
        onClick={() => {
          void signOut({ redirect: false }).then(() => {
            window.location.reload();
          });
        }}
      >
        {texts.invitePage.notYouSignOut}
      </Button>
    </Column>
  );
}

function InviteSignInForm({
  token,
  invitation,
}: {
  token: string;
  invitation: Extract<FindInvitationByTokenOutputDtoType, { status: "pending" }>;
}) {
  const { control, onSubmit, formState, hydrated } = useInviteSignIn({
    token,
    email: invitation.email,
    organizationName: invitation.organizationName,
  });

  if (!hydrated) {
    return <InvitePageFallback />;
  }

  return (
    <Column as="form" gap="md" width="full" onSubmit={onSubmit}>
      <Typography variant="heading-xs">{texts.invitePage.signInToJoin}</Typography>
      <FieldGroup>
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.workEmail.label}
          placeholder={texts.field.workEmail.placeholder}
          autoComplete="email"
          readOnly
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          autoComplete="current-password"
        />
        <Row justify="end" width="full">
          <Button
            nativeButton={false}
            variant="link"
            render={<Link href={url.forgotPassword({ invitation: token })} />}
          >
            {texts.invitePage.forgotPassword}
          </Button>
        </Row>
        <SubmitButton loading={formState.isSubmitting} size="lg" className="w-full">
          {texts.invitePage.signInToJoin}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}

function InviteSignUpForm({
  token,
  invitation,
}: {
  token: string;
  invitation: Extract<FindInvitationByTokenOutputDtoType, { status: "pending" }>;
}) {
  const { control, onSubmit, formState, hydrated } = useInviteSignUp({
    token,
    email: invitation.email,
    organizationName: invitation.organizationName,
  });

  if (!hydrated) {
    return <InvitePageFallback />;
  }

  return (
    <Column as="form" gap="md" width="full" onSubmit={onSubmit}>
      <Typography variant="heading-xs">{texts.invitePage.createAccountToJoin}</Typography>
      <FieldGroup>
        <TextField
          control={control}
          name="name"
          type="text"
          label={texts.field.name.label}
          placeholder={texts.field.name.placeholder}
          autoComplete="name"
        />
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.signUpWorkEmail.label}
          placeholder={texts.field.signUpWorkEmail.placeholder}
          autoComplete="email"
          readOnly
        />
        <PasswordField
          control={control}
          name="password"
          label={texts.field.password.label}
          placeholder={texts.field.password.placeholder}
          autoComplete="new-password"
        />
        <CheckboxField control={control} name="acceptedTerms" label={texts.field.acceptedTerms.label} />
        <SubmitButton loading={formState.isSubmitting} size="lg" className="w-full">
          {texts.invitePage.createAccountToJoin}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
