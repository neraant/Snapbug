import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { texts } from "@/client/modules/onboarding/consts/texts.const";

type OnboardingStepActionsProps = {
  showBack?: boolean;
  continueLabel?: string;
  loading?: boolean;
  onBack?: VoidFunction;
  onSkip?: VoidFunction;
};

export function OnboardingStepActions({
  showBack = false,
  continueLabel = texts.action.continue,
  loading = false,
  onBack,
  onSkip,
}: OnboardingStepActionsProps) {
  return (
    <Row justify="between" align="center" width="full" className="pt-2">
      {showBack ? (
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={loading}>
          <ArrowLeftIcon />
          {texts.action.back}
        </Button>
      ) : (
        <span />
      )}
      <Row gap="sm" align="center">
        {onSkip ? (
          <Button type="button" variant="link" onClick={onSkip} disabled={loading}>
            {texts.action.skip}
          </Button>
        ) : null}
        <SubmitButton type="submit" size="lg" loading={loading}>
          {continueLabel}
          <ArrowRightIcon />
        </SubmitButton>
      </Row>
    </Row>
  );
}
