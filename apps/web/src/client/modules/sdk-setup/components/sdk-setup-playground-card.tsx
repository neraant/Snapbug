import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { ExternalLinkIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useSdkSetupPlayground } from "@/client/modules/sdk-setup/hooks/use-sdk-setup-playground";

type SdkSetupPlaygroundCardProps = {
  projectId: string;
};

export function SdkSetupPlaygroundCard({ projectId }: SdkSetupPlaygroundCardProps) {
  const { host, allowsAnyOrigin, hostAllowed, isAdmin, isPending, allowHost, playgroundHref } =
    useSdkSetupPlayground(projectId);

  const hostStatus = allowsAnyOrigin
    ? texts.playground.allowAny
    : hostAllowed
      ? texts.playground.allowed
      : texts.playground.hostHint;

  return (
    <Panel>
      <Panel.Header title={texts.playground.title} description={texts.playground.description} />
      <Panel.Content gap="md">
        <Column gap="xs">
          <Typography variant="label">{texts.playground.hostLabel}</Typography>
          <Typography variant="text-sm" font="mono">
            {host}
          </Typography>
          <Typography variant="text-sm" color="muted">
            {hostStatus}
          </Typography>
        </Column>
        {hostAllowed || isAdmin ? null : (
          <Typography variant="text-xs" color="muted">
            {texts.widgetSettings.domainsAndMaskingAdmin}
          </Typography>
        )}
        <Row gap="sm" wrap={false}>
          {hostAllowed ? null : (
            <Button
              type="button"
              variant="outline"
              disabled={!isAdmin || isPending}
              onClick={() => {
                allowHost().catch(() => undefined);
              }}
            >
              {texts.playground.allow}
            </Button>
          )}
          <Button nativeButton={false} render={<a href={playgroundHref} target="_blank" rel="noopener noreferrer" />}>
            {texts.playground.open}
            <ExternalLinkIcon />
          </Button>
        </Row>
      </Panel.Content>
    </Panel>
  );
}

function SdkSetupPlaygroundCardFallback() {
  return <Skeleton className="h-48" />;
}

SdkSetupPlaygroundCard.Fallback = SdkSetupPlaygroundCardFallback;
