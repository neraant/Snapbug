import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { SignupMarkdown } from "@/client/modules/signup/components/signup-markdown";
import { texts } from "@/client/modules/signup/consts/texts.const";
import { formatBirthDate } from "@/client/modules/signup/utils/birth-date.util";
import type { SignupUserType } from "@/shared/signup/signup.schema";

type SignupSuccessProps = {
  user: SignupUserType;
  onReset: () => void;
};

export function SignupSuccess({ user, onReset }: SignupSuccessProps) {
  return (
    <Panel>
      <Panel.Header title={texts.success.title} description={texts.success.description} />
      <Panel.Content gap="lg">
        <Column gap="sm">
          <SignupSuccessRow label={texts.success.name} value={user.name} />
          <SignupSuccessRow label={texts.success.email} value={user.email} />
          <SignupSuccessRow
            label={texts.success.birthDate}
            value={user.birthDate ? formatBirthDate(user.birthDate) : texts.success.notSet}
          />
        </Column>
        <Column gap="xs">
          <Typography variant="label">{texts.success.about}</Typography>
          <SignupMarkdown source={user.about} />
        </Column>
        <Button variant="outline" onClick={onReset} className="self-start">
          {texts.success.reset}
        </Button>
      </Panel.Content>
    </Panel>
  );
}

type SignupSuccessRowProps = {
  label: string;
  value: string;
};

function SignupSuccessRow({ label, value }: SignupSuccessRowProps) {
  return (
    <Row justify="between" gap="md" wrap={false}>
      <Typography variant="text-sm" color="muted">
        {label}
      </Typography>
      <Typography variant="text-sm">{value}</Typography>
    </Row>
  );
}
