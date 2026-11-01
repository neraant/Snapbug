import { Center } from "@workspace/design-system/components/layout/center";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
import { Mascot } from "@workspace/design-system/components/ui/mascot";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { LayoutGridIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { texts } from "@/client/modules/error/consts/texts.const";
import { useErrorDetails } from "@/client/modules/error/hooks/use-error-details";
import { url } from "@/shared/build-url.util";

type ErrorScreenProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorScreen({ error, reset }: ErrorScreenProps) {
  const { copied, details, copy } = useErrorDetails({ error });

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center width="md">
      <Column align="center" gap="lg">
        <Mascot mood="confused" size="lg" />
        <Column align="center" gap="sm">
          <Typography variant="heading-lg" color="primary" align="center" font="heading">
            {texts.code}
          </Typography>
          <Typography variant="heading-xs" align="center" weight="bold">
            {texts.title}
          </Typography>
          <Typography variant="text-sm" color="muted" align="center">
            {texts.description}
          </Typography>
        </Column>
        <Row justify="center" gap="sm">
          <Button onClick={reset}>
            <RefreshCwIcon />
            {texts.tryAgain}
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link href={url.overview()} />}>
            <LayoutGridIcon />
            {texts.overview}
          </Button>
        </Row>
        <Card width="full" gap="none" padding="none">
          <Card.Header>
            <Card.Title variant="text-sm" weight="medium">
              {texts.details}
            </Card.Title>
            <Card.Action>
              <CopyButton
                variant="ghost"
                size="sm"
                copied={copied}
                onCopy={copy}
                copyLabel={texts.copy}
                copiedLabel={texts.copied}
              />
            </Card.Action>
          </Card.Header>
          <Separator />
          <Card.Content padding="md">
            {details.errorId ? (
              <Row justify="between" align="start" wrap={false}>
                <Typography variant="text-xs" color="muted">
                  {texts.errorId}
                </Typography>
                <Typography variant="text-xs" font="mono">
                  {details.errorId}
                </Typography>
              </Row>
            ) : null}
            <Row justify="between" align="start" wrap={false}>
              <Typography variant="text-xs" color="muted">
                {texts.timestamp}
              </Typography>
              <Typography variant="text-xs" font="mono">
                {details.timestamp}
              </Typography>
            </Row>
            <Typography variant="text-xs" color="muted">
              {details.message}
            </Typography>
          </Card.Content>
        </Card>
      </Column>
    </Center>
  );
}
