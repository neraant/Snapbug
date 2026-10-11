import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { ToolbarRow } from "@workspace/design-system/components/layout/toolbar-row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { BellIcon } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";

type PageHeaderToolbarProps = {
  notificationLabel: string;
  hasNotifications?: boolean;
};

function PageHeaderToolbar({ notificationLabel, hasNotifications = false }: PageHeaderToolbarProps) {
  return (
    <Row align="center" gap="sm" wrap={false}>
      <Button variant="ghost" size="icon" className="relative" aria-label={notificationLabel}>
        <BellIcon />
        {hasNotifications ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" /> : null}
      </Button>
    </Row>
  );
}

type PageProps = PropsWithChildren<{
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}>;

export function PageContainer({ title, description, badge, actions, children }: PageProps) {
  return (
    <Column gap="none" padding="none" width="full" className="flex-1">
      <Column gap="md" padding="lg">
        <ToolbarRow
          trailingAlign="end"
          leading={
            <Column gap="none">
              <Row align="center" gap="md" wrap={false}>
                <Typography variant="heading-lg" weight="bold" className="font-heading tracking-tight">
                  {title}
                </Typography>
                {badge}
              </Row>
              {description ? (
                <Typography variant="text-sm" color="muted" className="pt-1">
                  {description}
                </Typography>
              ) : null}
            </Column>
          }
          trailing={actions}
        />
      </Column>
      <Separator />
      <Column gap="xl" padding="lg">
        {children}
      </Column>
    </Column>
  );
}

PageContainer.HeaderToolbar = PageHeaderToolbar;
