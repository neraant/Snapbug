import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Card } from "@workspace/design-system/components/ui/card";
import { Input } from "@workspace/design-system/components/ui/input";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { PlusIcon, RocketIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { texts } from "@/client/modules/onboarding/consts/texts.const";
import { path } from "@/shared/path.const";

type OnboardingStepTeammateFormProps = {
  onBack: VoidFunction;
};

export function OnboardingStepTeammateForm({ onBack }: OnboardingStepTeammateFormProps) {
  const router = useRouter();
  const [emails, setEmails] = useState<string[]>([""]);

  const launch = () => {
    // TODO: SAB send invitations when the invitation procedure exists.
    router.replace(path.home);
  };

  const updateEmail = (index: number, value: string) => {
    setEmails((current) => current.map((email, emailIndex) => (emailIndex === index ? value : email)));
  };

  const addEmail = () => {
    setEmails((current) => [...current, ""]);
  };

  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-md">{texts.teammate.title}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.teammate.description}
        </Typography>
      </Column>
      <Column width="full" gap="md">
        {emails.map((email, index) => (
          <Input
            key={index}
            type="email"
            value={email}
            placeholder={texts.teammate.field.placeholder}
            onChange={(event) => updateEmail(index, event.target.value)}
            autoComplete="email"
          />
        ))}
        <Button type="button" variant="link" className="h-auto w-fit px-0" onClick={addEmail}>
          <PlusIcon />
          {texts.teammate.addAnother}
        </Button>
      </Column>
      <Card width="full" className="bg-muted/50">
        <Card.Header>
          <Card.Icon>
            <RocketIcon className="text-primary" />
          </Card.Icon>
          <Card.Title variant="text-sm" weight="bold">
            {texts.teammate.ready.title}
          </Card.Title>
          <Card.Description variant="text-xs">{texts.teammate.ready.description}</Card.Description>
        </Card.Header>
      </Card>
      <Column width="full" gap="md">
        <Row justify="between" align="center" width="full">
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            {texts.action.back}
          </Button>
          <Button type="button" size="lg" onClick={launch}>
            {texts.teammate.finish}
            <SparklesIcon />
          </Button>
        </Row>
        <Row justify="center" width="full" className="border-t pt-3">
          <Button type="button" variant="link" className="text-muted-foreground" onClick={launch}>
            {texts.teammate.skip}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
