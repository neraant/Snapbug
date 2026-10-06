import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps } from "react";

import { texts } from "@/client/modules/auth/consts/texts.const";

const preview = texts.auth.aside.preview;

type AuthAsidePreviewCardProps = ComponentProps<"div">;

export function AuthAsidePreviewCard({ className, ...props }: AuthAsidePreviewCardProps) {
  return (
    <div className={cn("w-full -rotate-2", className)} {...props}>
      <Card width="lg">
        <Row justify="between" align="center" gap="sm" wrap={false} minWidth="0">
          <Card.Title variant="text-xs" weight="bold">
            {preview.title}
          </Card.Title>
          <Card.Action>
            <Badge variant="destructive">{preview.severity}</Badge>
          </Card.Action>
        </Row>

        <Card.Content className="rounded-lg border border-border bg-muted p-3">
          <Row justify="between" align="center" gap="sm" wrap={false} minWidth="0">
            <Typography variant="text-xs" color="muted" truncate className="font-mono">
              {preview.error}
            </Typography>
            <Typography variant="text-xs" weight="bold" color="destructive" className="font-mono">
              {preview.statusCode}
            </Typography>
          </Row>
        </Card.Content>

        <Card.Footer justify="between" wrap={false} minWidth="0">
          <Row gap="sm" align="center" wrap={false} minWidth="0">
            <Avatar size="xs">
              <AvatarFallback>{preview.assigneeInitials}</AvatarFallback>
            </Avatar>
            <Typography variant="text-xs" color="muted">
              {preview.assigneeLabel}
            </Typography>
          </Row>
          <Typography variant="text-xs" className="font-mono text-success">
            {preview.replayStatus}
          </Typography>
        </Card.Footer>
      </Card>
    </div>
  );
}
