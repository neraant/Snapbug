import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { type RefObject, useState } from "react";

import { texts } from "@/client/modules/playground/consts/texts.const";

type PlaygroundSampleProps = {
  frameRef: RefObject<HTMLDivElement | null>;
};

export function PlaygroundSample({ frameRef }: PlaygroundSampleProps) {
  const [email, setEmail] = useState("");

  return (
    <Column width="full" gap="none" className="overflow-hidden rounded-xl border border-border bg-card">
      <Row
        align="center"
        justify="between"
        gap="md"
        wrap={false}
        width="full"
        className="border-b border-border bg-muted/40 p-3"
      >
        <Row align="center" gap="sm" wrap={false}>
          <Row align="center" gap="xs" wrap={false} aria-hidden>
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full bg-warning/80" />
            <span className="size-2.5 rounded-full bg-success/80" />
          </Row>
          <Typography variant="text-xs" color="muted" className="truncate font-mono">
            {texts.sample.addressBar}
          </Typography>
        </Row>
      </Row>

      <div ref={frameRef} className="relative min-h-96 bg-background" aria-label={texts.sample.frameAriaLabel}>
        <Column width="full" gap="lg" padding="lg">
          <Column width="full" gap="sm">
            <Typography variant="heading-lg" as="h2">
              {texts.sample.title}
            </Typography>
            <Typography variant="text-md" color="muted">
              {texts.sample.lead}
            </Typography>
          </Column>
          <Separator />
          <Column width="full" gap="xs">
            <Typography variant="label">{texts.sample.stepLabel}</Typography>
            <Typography variant="text-md">{texts.sample.stepValue}</Typography>
          </Column>
          <Column width="full" gap="xs">
            <Typography variant="label">{texts.sample.totalLabel}</Typography>
            <Typography variant="heading-sm">{texts.sample.totalValue}</Typography>
          </Column>
          <Separator />
          <Column gap="md" width="full">
            <Field>
              <FieldLabel htmlFor="playground-sample-email">{texts.sample.email}</FieldLabel>
              <Input
                id="playground-sample-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Column gap="xs" width="full">
              <Button
                type="button"
                onClick={() => {
                  console.error("Sample checkout pay failed");
                  fetch("/api/playground-sample-pay", { method: "POST" }).catch(() => undefined);
                }}
              >
                {texts.sample.pay}
              </Button>
              <Typography variant="text-xs" color="muted">
                {texts.sample.errorCaption}
              </Typography>
            </Column>
          </Column>
        </Column>
      </div>
    </Column>
  );
}
