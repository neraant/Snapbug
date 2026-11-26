import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { CopyIcon, EllipsisVerticalIcon, RefreshCwIcon, XIcon } from "lucide-react";

import { useFormatUserDate } from "@/client/modules/preference/hooks/use-format-user-date";
import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { InvitePeopleDialog } from "@/client/modules/team/components/invite-people-dialog";
import { texts } from "@/client/modules/team/consts/texts.const";
import { usePendingInvitations } from "@/client/modules/team/hooks/use-pending-invitations";
import { isInvitationExpired, isInvitationPending } from "@/client/modules/team/utils/count-pending-invitations.util";

export function PendingInvitations() {
  const { invitations, resend, revoke, copyLink, isMutating } = usePendingInvitations();
  const formatDate = useFormatUserDate();
  const formatInvitationDate = (value: string) => formatDate(value, { dateOnly: true });
  const { confirm, bind } = useConfirmDialog();
  const openInvitations = invitations.filter((invitation) => invitation.revokedAt === null);

  const openRevokeConfirm = (invitationId: string, email: string) => {
    confirm({
      title: texts.pending.revokeDialog.title(email),
      description: texts.pending.revokeDialog.description,
      confirmLabel: texts.pending.revokeDialog.confirm,
      variant: "destructive",
      errorFallback: texts.pending.revokeError,
      onConfirm: async () => {
        try {
          await revoke(invitationId);
        } catch (error) {
          throw new Error(getAppErrorMessage(error, texts.pending.revokeError));
        }
      },
    });
  };

  if (openInvitations.length === 0) {
    return (
      <Table.Shell>
        <Table.Empty message={texts.pending.empty} action={<InvitePeopleDialog />} />
      </Table.Shell>
    );
  }

  return (
    <Column gap="sm" width="full">
      <Table.Shell>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>{texts.pending.column.email}</Table.Head>
              <Table.Head>{texts.pending.column.sent}</Table.Head>
              <Table.Head>{texts.pending.column.expires}</Table.Head>
              <Table.Head>{texts.pending.column.status}</Table.Head>
              <Table.Head>{texts.pending.column.actions}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {openInvitations.map((invitation) => {
              const expired = isInvitationExpired(invitation);
              const pending = isInvitationPending(invitation);

              return (
                <Table.Row key={invitation.id}>
                  <Table.Cell>
                    <Typography variant="text-sm">{invitation.email}</Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography variant="text-sm" color="muted">
                      {formatInvitationDate(invitation.createdAt)}
                    </Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography variant="text-sm" color="muted">
                      {formatInvitationDate(invitation.expiresAt)}
                    </Typography>
                  </Table.Cell>
                  <Table.Cell>
                    {expired ? (
                      <Badge variant="warning">{texts.pending.status.expired}</Badge>
                    ) : pending ? (
                      <Badge variant="secondary">{texts.pending.status.pending}</Badge>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell>
                    <Row gap="xs" justify="end" wrap={false}>
                      {expired ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => resend(invitation.id)}
                        >
                          <RefreshCwIcon />
                          {texts.pending.resend}
                        </Button>
                      ) : null}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={texts.pending.menu(invitation.email)}
                              disabled={isMutating}
                            />
                          }
                        >
                          <EllipsisVerticalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!expired ? (
                            <DropdownMenuItem onClick={() => resend(invitation.id)}>
                              <RefreshCwIcon />
                              {texts.pending.resend}
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => copyLink(invitation.id)}>
                            <CopyIcon />
                            {texts.pending.copyLink}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openRevokeConfirm(invitation.id, invitation.email)}
                          >
                            <XIcon />
                            {texts.pending.revoke}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Row>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Table.Shell>
      <ConfirmDialog {...bind()} />
    </Column>
  );
}

PendingInvitations.Fallback = function PendingInvitationsFallback() {
  return <Skeleton className="h-72 w-full" />;
};
