import { Column } from "@workspace/design-system/components/layout/column";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/user-token/consts/texts.const";
import { useUserTokenList } from "@/client/modules/user-token/hooks/use-user-token-list";
import { formatUserTokenCreatedAt } from "@/client/modules/user-token/utils/format-user-token-created-at.util";

export function UserTokenList() {
  const { tokens, isPending, onRevoke } = useUserTokenList();

  return (
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
                <Typography variant="text-sm" font="mono">
                  {token.prefix}
                </Typography>
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
                    onClick={() => onRevoke(token.id)}
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
