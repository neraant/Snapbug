import {
  projectWidgetSettingModelSchema,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { useCallback, useEffect, useState } from "react";

import { useFindProjectWidgetSetting } from "@/client/shared/queries/use-find-project-widget-setting";
import { useUpdateProjectWidgetSetting } from "@/client/shared/queries/use-update-project-widget-setting";

const buttonLabelSchema = projectWidgetSettingModelSchema.shape.buttonLabel;

export function useSdkSetupWidgetSetting(projectId: string) {
  const { data: settings } = useFindProjectWidgetSetting({ projectId });
  const { mutateAsync: saveSettings, isPending } = useUpdateProjectWidgetSetting(projectId);
  const [buttonLabelDraft, setButtonLabelDraft] = useState(settings.buttonLabel);
  const [buttonLabelError, setButtonLabelError] = useState<string | null>(null);

  useEffect(() => {
    setButtonLabelDraft(settings.buttonLabel);
  }, [settings.buttonLabel]);

  const persist = useCallback(
    async (next: ProjectWidgetSettingModelType) => {
      await saveSettings({ projectId, settings: next });
    },
    [projectId, saveSettings],
  );

  const patchSettings = useCallback(
    (patch: Partial<ProjectWidgetSettingModelType>) => {
      persist({ ...settings, ...patch }).catch(() => undefined);
    },
    [persist, settings],
  );

  const patchPrivacy = useCallback(
    (patch: Partial<ProjectWidgetSettingModelType["privacy"]>) => {
      persist({ ...settings, privacy: { ...settings.privacy, ...patch } }).catch(() => undefined);
    },
    [persist, settings],
  );

  const commitButtonLabel = useCallback(() => {
    const result = buttonLabelSchema.safeParse(buttonLabelDraft);
    if (!result.success) {
      setButtonLabelError(result.error.issues[0]?.message ?? null);
      setButtonLabelDraft(settings.buttonLabel);
      return;
    }

    setButtonLabelError(null);
    if (result.data !== settings.buttonLabel) {
      persist({ ...settings, buttonLabel: result.data }).catch(() => undefined);
    }
  }, [buttonLabelDraft, persist, settings]);

  return {
    settings,
    isPending,
    buttonLabelDraft,
    setButtonLabelDraft,
    buttonLabelError,
    patchSettings,
    patchPrivacy,
    commitButtonLabel,
  };
}
