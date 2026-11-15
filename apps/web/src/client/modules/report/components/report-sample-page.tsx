"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { ReportWidget } from "@/client/modules/report/components/report-widget";
import { texts } from "@/client/modules/report/consts/texts.const";

type ReportSamplePageProps = {
  apiKey: string;
};

export function ReportSamplePage({ apiKey }: ReportSamplePageProps) {
  return (
    <Column width="full" gap="lg" padding="lg" className="mx-auto min-h-dvh max-w-2xl">
      <Column width="full" gap="sm">
        <Typography variant="heading-lg" as="h1">
          {texts.sample.title}
        </Typography>
        <Typography variant="text-md" color="muted">
          {texts.sample.lead}
        </Typography>
      </Column>
      <Separator />
      <Column width="full" gap="xs">
        <Typography variant="label">{texts.sample.stepLabel}</Typography>
        <Typography variant="text-md">{texts.sample.stepValue}</Typography>
      </Column>
      <Column width="full" gap="xs">
        <Typography variant="label">{texts.sample.totalLabel}</Typography>
        <Typography variant="heading-sm">{texts.sample.totalValue}</Typography>
      </Column>
      <ReportWidget apiKey={apiKey} />
    </Column>
  );
}
