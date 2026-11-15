"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Button } from "@workspace/design-system/components/ui/button";
import { FormError } from "@workspace/design-system/components/ui/form-error";
import { Input } from "@workspace/design-system/components/ui/input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { Loader2Icon } from "lucide-react";
import { type ComponentProps, type ReactNode, useRef, useState } from "react";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "default" | "destructive";
  pending?: boolean;
  error?: string | null;
  confirmText?: string;
  typeToConfirm?: {
    prefix: string;
    suffix: string;
  };
  onConfirm: () => void | Promise<void>;
};

function ConfirmDialogContent({ className, children, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        data-slot="confirm-dialog-overlay"
        className="fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
      />
      <AlertDialogPrimitive.Popup
        data-slot="confirm-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border bg-popover p-6 text-left text-popover-foreground shadow-lg transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  );
}

function ConfirmDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="confirm-dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function ConfirmDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="confirm-dialog-footer" className={cn("flex justify-end gap-2", className)} {...props} />;
}

function ConfirmDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="confirm-dialog-title"
      className={cn("font-heading text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function ConfirmDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="confirm-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  pending = false,
  error,
  confirmText,
  typeToConfirm,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [typedValue, setTypedValue] = useState("");

  const needsTypedConfirmation = confirmText != null;
  const typedValueMatches = !needsTypedConfirmation || typedValue === confirmText;
  const isDestructive = variant === "destructive";

  const handleOpenChange = (nextOpen: boolean, eventDetails: AlertDialogPrimitive.Root.ChangeEventDetails) => {
    if (!nextOpen && pending) {
      eventDetails.preventUnmountOnClose();
      return;
    }

    if (!nextOpen) {
      setTypedValue("");
    }

    onOpenChange(nextOpen);
  };

  const runConfirm = () => {
    const result = onConfirm();
    if (result instanceof Promise) {
      result.catch(() => undefined);
    }
  };

  const handleConfirmKeyDown: ComponentProps<"button">["onKeyDown"] = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    runConfirm();
  };

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <ConfirmDialogContent>
        <ConfirmDialogHeader>
          <ConfirmDialogTitle>{title}</ConfirmDialogTitle>
          <ConfirmDialogDescription>{description}</ConfirmDialogDescription>
        </ConfirmDialogHeader>
        {needsTypedConfirmation && confirmText && typeToConfirm ? (
          <div className="flex flex-col gap-2">
            <Typography variant="text-sm" color="muted">
              {typeToConfirm.prefix}{" "}
              <Typography as="span" variant="text-sm" weight="semibold">
                {confirmText}
              </Typography>{" "}
              {typeToConfirm.suffix}
            </Typography>
            <Input
              value={typedValue}
              onChange={(event) => setTypedValue(event.target.value)}
              autoComplete="off"
              disabled={pending}
            />
          </div>
        ) : null}
        {error ? <FormError>{error}</FormError> : null}
        <ConfirmDialogFooter>
          <AlertDialogPrimitive.Close
            render={
              <Button ref={cancelRef} type="button" variant="outline" disabled={pending} autoFocus={isDestructive} />
            }
          >
            {cancelLabel}
          </AlertDialogPrimitive.Close>
          <Button
            ref={confirmRef}
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            autoFocus={!isDestructive}
            disabled={pending || !typedValueMatches}
            onKeyDown={handleConfirmKeyDown}
            onClick={runConfirm}
          >
            {pending ? <Loader2Icon className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </ConfirmDialogFooter>
      </ConfirmDialogContent>
    </AlertDialogPrimitive.Root>
  );
}

export { ConfirmDialog };
export type { ConfirmDialogProps };
