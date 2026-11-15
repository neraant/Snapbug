import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CopyIcon, EllipsisVerticalIcon, RefreshCwIcon, XIcon } from "lucide-react";

import { texts } from "@/client/modules/team/consts/texts.const";
import { usePendingInvitations } from "@/client/modules/team/hooks/use-pending-invitations";

export function PendingInvitations() {
  const { invitations, resend, revoke, copyLink, isMutating } = usePendingInvitations();
  const now = Date.now();
  const activeInvitations = invitations.filter(
    (invitation) => invitation.revokedAt === null && new Date(invitation.expiresAt).getTime() > now,
  );

  if (activeInvitations.length === 0) {
    return null;
  }

  return (
    <Column gap="sm" width="full">
      <Typography variant="heading-xs">{texts.pending.title}</Typography>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>{texts.pending.column.email}</Table.Head>
            <Table.Head>{texts.pending.column.expires}</Table.Head>
            <Table.Head>{texts.pending.column.actions}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activeInvitations.map((invitation) => (
            <Table.Row key={invitation.id}>
              <Table.Cell>
                <Typography variant="text-sm">{invitation.email}</Typography>
              </Table.Cell>
              <Table.Cell>
                <Typography variant="text-sm" color="muted">
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </Typography>
              </Table.Cell>
              <Table.Cell>
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
                    <DropdownMenuItem onClick={() => resend(invitation.id)}>
                      <RefreshCwIcon />
                      {texts.pending.resend}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyLink(invitation.id)}>
                      <CopyIcon />
                      {texts.pending.copyLink}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => revoke(invitation.id)}>
                      <XIcon />
                      {texts.pending.revoke}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Column>
  );
}

PendingInvitations.Fallback = function PendingInvitationsFallback() {
  return <Skeleton className="h-24 w-full" />;
};
