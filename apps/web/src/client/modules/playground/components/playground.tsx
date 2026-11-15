import { Column } from "@workspace/design-system/components/layout/column";
import { useMemo } from "react";

import { PlaygroundCapture } from "@/client/modules/playground/components/playground-capture";
import { PlaygroundSample } from "@/client/modules/playground/components/playground-sample";
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
  const capture = usePlaygroundWidget(widgetOptions);

  return (
    <Column gap="lg" width="full" minWidth="0">
      <PlaygroundSample />
      {capture ? <PlaygroundCapture capture={capture} /> : null}
    </Column>
  );
}
