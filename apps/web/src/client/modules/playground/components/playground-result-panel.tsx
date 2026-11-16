import type { WidgetPreviewCapture } from "@neraant/snapbug";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { ArrowLeftIcon } from "lucide-react";

import { PlaygroundCapture } from "@/client/modules/playground/components/playground-capture";
import { texts } from "@/client/modules/playground/consts/texts.const";

type PlaygroundResultPanelProps = {
  capture: WidgetPreviewCapture | null;
  isPending: boolean;
  error: string | null;
  onReset: () => void;
  onOpenWidget: () => void;
  onRetry: () => void;
};

export function PlaygroundResultPanel({
  capture,
  isPending,
  error,
  onReset,
  onOpenWidget,
  onRetry,
}: PlaygroundResultPanelProps) {
  return (
    <Panel width="full" minWidth="0" className="xl:sticky xl:top-0 xl:self-start">
      <Panel.Header
        title={texts.result.title}
        action={
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            {texts.result.reset}
          </Button>
        }
      />
      <Panel.Content padding="md">
        {error ? <PlaygroundResultError onRetry={onRetry} /> : null}
        {!error && isPending ? <PlaygroundResultPending /> : null}
        {!error && !isPending && !capture ? <PlaygroundResultEmpty onOpenWidget={onOpenWidget} /> : null}
        {!error && !isPending && capture ? <PlaygroundCapture capture={capture} /> : null}
      </Panel.Content>
    </Panel>
  );
}

type PlaygroundResultEmptyProps = {
  onOpenWidget: () => void;
};

function PlaygroundResultEmpty({ onOpenWidget }: PlaygroundResultEmptyProps) {
  return (
    <Column align="center" justify="center" gap="md" width="full" className="py-10">
      <Row
        align="center"
        justify="center"
        className="size-12 rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground"
        aria-hidden
      >
        <ArrowLeftIcon className="size-5" />
      </Row>
      <Typography variant="text-sm" color="muted" align="center" className="max-w-xs">
        {texts.result.emptyDescription}
      </Typography>
      <Button type="button" variant="outline" onClick={onOpenWidget}>
        {texts.result.openWidget}
      </Button>
    </Column>
  );
}

function PlaygroundResultPending() {
  return (
    <Column gap="md" width="full" aria-busy="true" aria-label={texts.result.pendingAriaLabel}>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </Column>
  );
}

type PlaygroundResultErrorProps = {
  onRetry: () => void;
};

function PlaygroundResultError({ onRetry }: PlaygroundResultErrorProps) {
  return (
    <Column gap="md" width="full">
      <Typography variant="text-sm" color="muted">
        {texts.result.errorMessage}
      </Typography>
      <Row width="full">
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {texts.result.retry}
        </Button>
      </Row>
    </Column>
  );
}