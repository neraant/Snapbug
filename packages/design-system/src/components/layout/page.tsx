import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { PropsWithChildren, ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Row align="center" justify="between">
      <Column gap="none" minWidth="0" className="flex-1">
        <Typography variant="heading-md">{title}</Typography>
        {description ? (
          <Typography variant="text-sm" color="muted">
            {description}
          </Typography>
        ) : null}
      </Column>
      {actions ? (
        <Row gap="sm" wrap={false}>
          {actions}
        </Row>
      ) : null}
    </Row>
  );
}

type PageProps = PropsWithChildren<PageHeaderProps>;

export function PageContainer({ title, description, actions, children }: PageProps) {
  return (
    <Column gap="xl">
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </Column>
  );
}
