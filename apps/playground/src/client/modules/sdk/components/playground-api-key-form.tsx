import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { type FormEvent, useState } from "react";

import { texts } from "@/client/modules/sdk/consts/texts.const";
import { usePlaygroundApiKey } from "@/client/modules/sdk/hooks/use-playground-api-key";

export function PlaygroundApiKeyForm() {
  const { apiKey, connect, forget } = usePlaygroundApiKey();
  const [draft, setDraft] = useState("");

  if (apiKey) {
    return (
      <Row width="full" justify="between" align="center" wrap={false}>
        <Typography variant="text-sm" color="muted">
          {texts.apiKey.connected}
        </Typography>
        <Button type="button" variant="outline" onClick={forget}>
          {texts.apiKey.forget}
        </Button>
      </Row>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    connect(draft);
    setDraft("");
  };

  return (
    <Column as="form" gap="sm" width="full" onSubmit={onSubmit}>
      <Field>
        <FieldLabel htmlFor="playground-api-key">{texts.apiKey.label}</FieldLabel>
        <Input
          id="playground-api-key"
          name="apiKey"
          value={draft}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setDraft(event.target.value)}
        />
      </Field>
      <SubmitButton disabled={draft.trim().length === 0}>{texts.apiKey.connect}</SubmitButton>
    </Column>
  );
}
