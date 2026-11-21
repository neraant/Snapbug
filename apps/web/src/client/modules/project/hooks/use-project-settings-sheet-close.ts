import { useCallback } from "react";

import { texts } from "@/client/modules/project/consts/texts.const";

type ConfirmClose = (request: {
  title: string;
  description: string;
  confirmLabel: string;
  variant: "destructive";
  onConfirm: VoidFunction;
}) => void;

type UseProjectSettingsSheetCloseInput = {
  isDirty: boolean;
  onOpenChange: (open: boolean) => void;
  reset: VoidFunction;
  confirm: ConfirmClose;
};

export function useProjectSettingsSheetClose({
  isDirty,
  onOpenChange,
  reset,
  confirm,
}: UseProjectSettingsSheetCloseInput) {
  const close = useCallback(() => {
    if (isDirty) {
      confirm({
        title: texts.settingsSheet.unsavedClose.title,
        description: texts.settingsSheet.unsavedClose.description,
        confirmLabel: texts.settingsSheet.unsavedClose.confirm,
        variant: "destructive",
        onConfirm: () => {
          reset();
          onOpenChange(false);
        },
      });
      return;
    }
    onOpenChange(false);
  }, [confirm, isDirty, onOpenChange, reset]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        onOpenChange(true);
        return;
      }
      close();
    },
    [close, onOpenChange],
  );

  return { close, handleOpenChange };
}
