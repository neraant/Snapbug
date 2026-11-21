"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/design-system/components/ui/dialog";
import { Input } from "@workspace/design-system/components/ui/input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon, EyeIcon, EyeOffIcon, KeyRoundIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import { mcpTabs } from "@/client/modules/mcp/consts/mcp-tab.const";
import { secretRevealDialogTexts as texts } from "@/client/modules/shared/consts/secret-reveal-dialog.const";
import { useSecretRevealField } from "@/client/modules/shared/hooks/use-secret-reveal-field";
import { maskSecret } from "@/client/modules/shared/utils/mask-secret.util";
import { url } from "@/shared/build-url.util";

type SecretRevealDialogKind = "userToken" | "apiKey";

type SecretRevealDialogProps = {
  secret: string;
  kind: SecretRevealDialogKind;
  metadataName?: string;
  onDone: VoidFunction;
};

export function SecretRevealDialog({ secret, kind, metadataName, onDone }: SecretRevealDialogProps) {
  const { copied, hasCopiedOnce, onCopy, onToggleReveal, revealed } = useSecretRevealField(secret);

  const title = kind === "userToken" ? texts.userToken.title : texts.apiKey.title;
  const displayValue = revealed ? secret : maskSecret(secret);
  const doneLabel = hasCopiedOnce ? texts.done : texts.doneNudge;
  const connectHref = `${url.mcp()}?tab=${mcpTabs.connect}`;

  const metadataLine = [metadataName, texts.createdJustNow].filter(Boolean).join(" · ");

  return (
    <>
      <DialogHeader className="gap-3">
        <Row align="center" gap="sm" wrap={false}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
            {kind === "userToken" ? (
              <CheckIcon className="size-5 text-foreground" aria-hidden="true" />
            ) : (
              <KeyRoundIcon className="size-5 text-foreground" aria-hidden="true" />
            )}
          </div>
          <Column gap="xs" className="min-w-0">
            <DialogTitle className="text-left">{title}</DialogTitle>
            <DialogDescription className="text-left">{texts.description}</DialogDescription>
          </Column>
        </Row>
      </DialogHeader>

      <Row
        align="start"
        gap="sm"
        wrap={false}
        className="rounded-lg border border-warning/20 bg-warning-surface px-3 py-2 text-warning-surface-foreground"
      >
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        <Typography variant="text-xs" color="inherit">
          {texts.warning}
        </Typography>
      </Row>

      <Column gap="xs" width="full">
        <Column gap="sm" className="w-full min-w-0 sm:hidden">
          <div className="relative w-full min-w-0">
            <Input
              readOnly
              value={displayValue}
              aria-label={title}
              className="h-10 pr-10 font-mono text-sm"
              onFocus={(event) => event.currentTarget.select()}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={revealed ? texts.hide : texts.reveal}
              aria-pressed={revealed}
              className="absolute inset-y-0 right-0 h-full w-10 rounded-none bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
              onClick={onToggleReveal}
            >
              {revealed ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </Button>
          </div>
          <CopyButton
            copied={copied}
            onCopy={() => {
              onCopy().catch(() => undefined);
            }}
            copyLabel={texts.copy}
            copiedLabel={texts.copied}
            className="w-full"
          />
        </Column>
        <div className="relative hidden w-full min-w-0 sm:block">
          <Input
            readOnly
            value={displayValue}
            aria-label={title}
            className="h-10 pr-36 font-mono text-sm"
            onFocus={(event) => event.currentTarget.select()}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={revealed ? texts.hide : texts.reveal}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-24 h-full w-10 rounded-none bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={onToggleReveal}
          >
            {revealed ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            <CopyButton
              copied={copied}
              onCopy={() => {
                onCopy().catch(() => undefined);
              }}
              copyLabel={texts.copy}
              copiedLabel={texts.copied}
              size="sm"
              className="h-8 shrink-0"
            />
          </div>
        </div>
        {metadataLine ? (
          <Typography variant="text-xs" color="muted">
            {metadataLine}
          </Typography>
        ) : null}
      </Column>

      {kind === "userToken" ? (
        <Typography variant="text-sm" color="muted">
          <Link href={connectHref} className="text-foreground underline-offset-4 hover:underline" onClick={onDone}>
            {texts.userToken.connectLink}
          </Link>
        </Typography>
      ) : null}

      <DialogFooter>
        <DialogClose render={<Button type="button" onClick={onDone} />}>{doneLabel}</DialogClose>
      </DialogFooter>
    </>
  );
}
