import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
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
    <Column gap="xl" padding="lg" width="full" className="flex-1">
      <Row align="end" justify="between" wrap className="border-b border-border pb-2">
        <Column gap="none" className="min-w-[min(100%,24rem)] flex-1">
          <Row align="center" gap="md" wrap={false}>
            <Typography variant="heading-lg" className="font-heading font-extrabold tracking-tight">
              {title}
            </Typography>
            {badge}
          </Row>
          {description ? (
            <Typography variant="text-sm" className="pt-1 text-secondary-foreground">
              {description}
            </Typography>
          ) : null}
        </Column>
        {actions ? (
          <Row gap="sm" className="ml-auto">
            {actions}
          </Row>
        ) : null}
      </Row>
      {children}
    </Column>
  );
}

PageContainer.HeaderToolbar = PageHeaderToolbar;
