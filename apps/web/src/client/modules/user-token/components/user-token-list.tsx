import { Column } from "@workspace/design-system/components/layout/column";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { ConfirmDialog } from "@workspace/design-system/components/ui/confirm-dialog";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { toast } from "@workspace/design-system/components/ui/toast";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";

import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { texts } from "@/client/modules/user-token/consts/texts.const";
import { useUserTokenList } from "@/client/modules/user-token/hooks/use-user-token-list";
import { formatUserTokenCreatedAt } from "@/client/modules/user-token/utils/format-user-token-created-at.util";

export function UserTokenList() {
  const { tokens, isPending, onRevoke, revokeSuccessMessage, revokeErrorMessage } = useUserTokenList();
  const { confirm, bind } = useConfirmDialog();

  const openRevokeConfirm = (tokenId: string, tokenName: string) => {
    confirm({
      title: texts.revoke.dialog.title(tokenName),
      description: texts.revoke.dialog.description,
      confirmLabel: texts.revoke.dialog.confirm,
      variant: "destructive",
      errorFallback: revokeErrorMessage,
      onConfirm: async () => {
        try {
          await onRevoke(tokenId);
          toast.add({ title: revokeSuccessMessage, type: "success" });
        } catch (error) {
          throw new Error(getAppErrorMessage(error, revokeErrorMessage));
        }
      },
    });
  };

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>{texts.column.token}</Table.Head>
            <Table.Head>{texts.column.created}</Table.Head>
            <Table.Head>{texts.column.status}</Table.Head>
            <Table.Head />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tokens.map((token) => {
            const revoked = token.revokedAt !== null;

            return (
              <Table.Row key={token.id}>
                <Table.Cell>
                  <Typography variant="text-sm">{token.name}</Typography>
                </Table.Cell>
                <Table.Cell>
                  <Typography variant="text-sm">{formatUserTokenCreatedAt(token.createdAt)}</Typography>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={revoked ? "outline" : "success"}>
                    {revoked ? texts.status.revoked : texts.status.active}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {revoked ? null : (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => openRevokeConfirm(token.id, token.name)}
                    >
                      {texts.revoke.action}
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
          {tokens.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Typography variant="text-sm" color="muted" align="center">
                  {texts.empty}
                </Typography>
              </Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
      <ConfirmDialog {...bind()} />
    </>
  );
}

function UserTokenListFallback() {
  return (
    <Column gap="sm" width="full">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
    </Column>
  );
}

UserTokenList.Fallback = UserTokenListFallback;
