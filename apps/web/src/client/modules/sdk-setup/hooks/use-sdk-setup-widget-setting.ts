import {
  projectWidgetSettingModelSchema,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { widgetHexColorSchema } from "@workspace/validation/shared/widget-hex-color.schema";
import { useCallback, useEffect, useRef, useState } from "react";

const hexColorSaveDebounceMs = 350;

import { useFindProjectWidgetSetting } from "@/client/shared/queries/use-find-project-widget-setting";
import { useUpdateProjectWidgetSetting } from "@/client/shared/queries/use-update-project-widget-setting";

const buttonLabelSchema = projectWidgetSettingModelSchema.shape.buttonLabel;

type HexSettingKey = "background" | "text" | "mutedText";

function useHexSettingDraft(
  settings: ProjectWidgetSettingModelType,
  field: HexSettingKey,
  persist: (next: ProjectWidgetSettingModelType) => Promise<void>,
) {
  const value = settings[field];
  const [draft, setDraft] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const apply = useCallback(
    (raw: string) => {
      const normalized = raw.startsWith("#") ? raw : `#${raw}`;
      const result = widgetHexColorSchema.safeParse(normalized);
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? null);
        setDraft(value ?? "");
        return;
      }

      setError(null);
      setDraft(result.data);

      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (result.data === value) {
        return;
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        persist({ ...settings, [field]: result.data }).catch(() => undefined);
      }, hexColorSaveDebounceMs);
    },
    [field, persist, settings, value],
  );

  const clear = useCallback(() => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setError(null);
    setDraft("");
    if (value !== undefined) {
      persist({ ...settings, [field]: undefined }).catch(() => undefined);
    }
  }, [field, persist, settings, value]);

  return { draft, error, apply, clear, committed: value };
}

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

  const background = useHexSettingDraft(settings, "background", persist);
  const text = useHexSettingDraft(settings, "text", persist);
  const mutedText = useHexSettingDraft(settings, "mutedText", persist);

  return {
    settings,
    isPending,
    buttonLabelDraft,
    setButtonLabelDraft,
    buttonLabelError,
    backgroundDraft: background.draft,
    backgroundCommitted: background.committed,
    backgroundError: background.error,
    applyBackground: background.apply,
    clearBackground: background.clear,
    textDraft: text.draft,
    textCommitted: text.committed,
    textError: text.error,
    applyText: text.apply,
    clearText: text.clear,
    mutedTextDraft: mutedText.draft,
    mutedTextCommitted: mutedText.committed,
    mutedTextError: mutedText.error,
    applyMutedText: mutedText.apply,
    clearMutedText: mutedText.clear,
    patchSettings,
    patchPrivacy,
    commitButtonLabel,
  };
}
