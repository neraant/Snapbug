import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { PropsWithChildren, ReactNode } from "react";

type SettingsSectionsProps = PropsWithChildren;

export function SettingsSections({ children }: SettingsSectionsProps) {
  return (
    <Column gap="none" width="full" className="w-full max-w-4xl">
      {children}
    </Column>
  );
}

type SettingsSectionProps = PropsWithChildren<{
  title: string;
  description: string;
  leading?: ReactNode;
  showSeparator?: boolean;
}>;

export function SettingsSection({ title, description, leading, children, showSeparator = true }: SettingsSectionProps) {
  return (
    <>
      {showSeparator ? <Separator className="mb-8" /> : null}
      <Grid gap="lg" className="grid-cols-1 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-x-12">
        <Column gap="sm" minWidth="0">
          <Typography variant="heading-xs" weight="semibold">
            {title}
          </Typography>
          <Typography variant="text-sm" color="muted">
            {description}
          </Typography>
          {leading}
        </Column>
        <Column gap="md" align="stretch" minWidth="0" width="full">
          {children}
        </Column>
      </Grid>
    </>
  );
}

type SettingsSectionFormFooterProps = PropsWithChildren;

export function SettingsSectionFormFooter({ children }: SettingsSectionFormFooterProps) {
  return (
    <Row gap="md" align="center" wrap>
      {children}
    </Row>
  );
}
