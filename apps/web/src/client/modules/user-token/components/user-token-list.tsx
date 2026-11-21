import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
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
import { toast } from "@workspace/design-system/components/ui/toast";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { EllipsisVerticalIcon } from "lucide-react";

import { useConfirmDialog } from "@/client/modules/shared/hooks/use-confirm-dialog";
import { CreateUserTokenDialog } from "@/client/modules/user-token/components/create-user-token-dialog";
import { UserTokenScopeBadges } from "@/client/modules/user-token/components/user-token-scope-badges";
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

  const activeTokens = tokens.filter((token) => token.revokedAt === null);

  return (
    <>
      <Column gap="md" width="full">
        <CreateUserTokenDialog />
        {activeTokens.length === 0 ? (
          <Table.Shell>
            <Table.Empty message={texts.empty} mascot={false} />
          </Table.Shell>
        ) : (
          <Table.Shell>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{texts.column.token}</Table.Head>
                  <Table.Head>{texts.column.scopes}</Table.Head>
                  <Table.Head>{texts.column.created}</Table.Head>
                  <Table.Head>{texts.column.actions}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {activeTokens.map((token) => (
                  <Table.Row key={token.id}>
                    <Table.Cell>
                      <Typography variant="text-sm">{token.name}</Typography>
                    </Table.Cell>
                    <Table.Cell>
                      <Row gap="xs" wrap>
                        <UserTokenScopeBadges
                          scopePreset={token.scopePreset}
                          scopes={token.scopes}
                          projectIds={token.projectIds}
                        />
                      </Row>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      <Typography variant="text-sm">{formatUserTokenCreatedAt(token.createdAt)}</Typography>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isPending}
                              aria-label={texts.actionsMenuLabel}
                            />
                          }
                        >
                          <EllipsisVerticalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openRevokeConfirm(token.id, token.name)}
                          >
                            {texts.revoke.action}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Table.Shell>
        )}
      </Column>
      <ConfirmDialog {...bind()} />
    </>
  );
}

function UserTokenListFallback() {
  return (
    <Column gap="sm" width="full">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-48 w-full" />
    </Column>
  );
}

UserTokenList.Fallback = UserTokenListFallback;
