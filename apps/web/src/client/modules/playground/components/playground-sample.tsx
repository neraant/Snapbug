import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useState } from "react";

import { texts } from "@/client/modules/playground/consts/texts.const";

export function PlaygroundSample() {
  const [email, setEmail] = useState("");

  return (
    <Column width="full" gap="lg" padding="lg" className="mx-auto max-w-2xl rounded-xl border border-border bg-background">
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
        <Button
          type="button"
          onClick={() => {
            console.error("Sample checkout pay failed");
          }}
        >
          {texts.sample.pay}
        </Button>
      </Column>
    </Column>
  );
}