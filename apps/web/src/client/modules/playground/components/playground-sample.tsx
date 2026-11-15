import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Field, FieldLabel } from "@workspace/design-system/components/ui/field";
import { Input } from "@workspace/design-system/components/ui/input";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { useState } from "react";

import { texts } from "@/client/modules/playground/consts/texts.const";

export function PlaygroundSample() {
  const [email, setEmail] = useState("");

  return (
    <Panel width="full">
      <Panel.Header title={texts.sample.title} description={texts.sample.description} />
      <Panel.Content>
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
      </Panel.Content>
    </Panel>
  );
}
