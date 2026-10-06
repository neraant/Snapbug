"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CopyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { texts } from "@/client/modules/onboarding/consts/texts.const";

// TODO: SAB insert the project API key when key issuance exists.
const PLACEHOLDER_API_KEY = "sb_live_...";
const FALLBACK_HOST = "https://app.example.com";

function buildSnippet(host: string): string {
  return [
    "npm install @workspace/sdk",
    "",
    "import { snapbug } from '@workspace/sdk';",
    "",
    "snapbug.init({",
    `  apiKey: '${PLACEHOLDER_API_KEY}',`,
    `  host: '${host}',`,
    "});",
  ].join("\n");
}

export function OnboardingInstallSnippet() {
  const [copied, setCopied] = useState(false);
  const [host, setHost] = useState(FALLBACK_HOST);
  const snippet = useMemo(() => buildSnippet(host), [host]);

  useEffect(() => {
    setHost(window.location.origin);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card width="full" padding="md" gap="sm" className="rounded-xl bg-muted shadow-none">
      <Row width="full" align="center" justify="between">
        <Row gap="sm" align="center">
          <Typography variant="text-xs" weight="bold">
            {texts.project.install.title}
          </Typography>
          <Typography
            as="span"
            variant="text-xs"
            color="muted"
            className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]"
          >
            {texts.project.install.package}
          </Typography>
        </Row>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto gap-1.5 text-orange-400 hover:text-orange-500"
          onClick={copy}
        >
          <CopyIcon className="size-3.5 shrink-0" />
          {copied ? texts.project.install.copied : texts.project.install.copy}
        </Button>
      </Row>
      <Column
        width="full"
        className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] leading-[1.625] tracking-tight whitespace-pre text-foreground"
      >
        {snippet}
      </Column>
    </Card>
  );
}
