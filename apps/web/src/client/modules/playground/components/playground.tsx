import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { useMemo, useRef } from "react";

import { PlaygroundResultPanel } from "@/client/modules/playground/components/playground-result-panel";
import { PlaygroundSample } from "@/client/modules/playground/components/playground-sample";
import { PlaygroundStepStrip } from "@/client/modules/playground/components/playground-step-strip";
import { usePlaygroundWidget } from "@/client/modules/playground/hooks/use-playground-widget";
import { buildSnapbugWidgetInitOptions } from "@/client/modules/sdk-setup/utils/build-snapbug-widget-init-options.util";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useFindProjectWidgetSetting } from "@/client/modules/shared/queries/use-find-project-widget-setting";

export function Playground() {
  const { projectId } = useProjectScopeSearchParam();

  if (!projectId) {
    return <PlaygroundBody />;
  }

  return <PlaygroundScoped projectId={projectId} />;
}

type PlaygroundScopedProps = {
  projectId: string;
};

function PlaygroundScoped({ projectId }: PlaygroundScopedProps) {
  const { data: widgetSettings } = useFindProjectWidgetSetting({ projectId });
  const widgetOptions = useMemo(() => buildSnapbugWidgetInitOptions(widgetSettings), [widgetSettings]);

  return <PlaygroundBody widgetOptions={widgetOptions} />;
}

const emptyWidgetOptions = {};

type PlaygroundBodyProps = {
  widgetOptions?: ReturnType<typeof buildSnapbugWidgetInitOptions>;
};

function PlaygroundBody({ widgetOptions = emptyWidgetOptions }: PlaygroundBodyProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const playground = usePlaygroundWidget({ widgetOptions, frameRef });

  return (
    <Column gap="lg" width="full" minWidth="0">
      <PlaygroundStepStrip step={playground.step} />
      <Grid gap="lg" columns={1} className="xl:grid-cols-[3fr_2fr] xl:items-start">
        <PlaygroundSample frameRef={frameRef} />
        <PlaygroundResultPanel
          capture={playground.capture}
          isPending={playground.isPending}
          error={playground.error}
          onReset={playground.reset}
          onOpenWidget={playground.openWidget}
          onRetry={playground.retry}
        />
      </Grid>
    </Column>
  );
}
