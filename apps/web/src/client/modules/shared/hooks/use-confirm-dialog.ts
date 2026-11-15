import type { ConfirmDialogProps } from "@workspace/design-system/components/ui/confirm-dialog";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useCallback, useState } from "react";

import { texts } from "@/client/modules/shared/consts/texts.const";

type ConfirmRequest = Pick<ConfirmDialogProps, "title" | "description" | "confirmLabel" | "variant" | "confirmText"> & {
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  errorFallback?: string;
};

export function useConfirmDialog() {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    if (pending) return;
    setRequest(null);
    setError(null);
  }, [pending]);

  const confirm = useCallback((nextRequest: ConfirmRequest) => {
    setRequest({
      ...nextRequest,
      cancelLabel: nextRequest.cancelLabel ?? texts.confirm.cancel,
    });
    setError(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) close();
    },
    [close],
  );

  const handleConfirm = useCallback(async () => {
    if (!request || pending) return;

    setPending(true);
    setError(null);

    try {
      await request.onConfirm();
      setRequest(null);
    } catch (catchError: unknown) {
      setError(getAppErrorMessage(catchError, request.errorFallback ?? texts.confirm.error));
    } finally {
      setPending(false);
    }
  }, [pending, request]);

  const bind = useCallback((): ConfirmDialogProps => {
    return {
      open: request !== null,
      onOpenChange: handleOpenChange,
      title: request?.title ?? "",
      description: request?.description ?? "",
      confirmLabel: request?.confirmLabel ?? "",
      cancelLabel: request?.cancelLabel ?? texts.confirm.cancel,
      variant: request?.variant,
      confirmText: request?.confirmText,
      typeToConfirm: texts.confirm.typeToConfirm,
      pending,
      error,
      onConfirm: handleConfirm,
    };
  }, [error, handleConfirm, handleOpenChange, pending, request]);

  return { confirm, bind };
}
