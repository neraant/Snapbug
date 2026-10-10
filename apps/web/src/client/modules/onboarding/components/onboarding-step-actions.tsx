import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { cn } from "@workspace/design-system/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { texts } from "@/client/modules/onboarding/consts/texts.const";

type OnboardingStepActionsProps = {
  continueLabel?: string;
  continueIcon?: ReactNode;
  loading?: boolean;
  onBack?: VoidFunction;
  onSkip?: VoidFunction;
  skipLabel?: string;
  onPrimaryClick?: VoidFunction;
};

export function OnboardingStepActions({
  continueLabel = texts.action.continue,
  continueIcon = <ArrowRightIcon />,
  loading = false,
  onBack,
  onSkip,
  skipLabel = texts.action.skip,
  onPrimaryClick,
}: OnboardingStepActionsProps) {
  return (
    <Column width="full" gap="md" className="pt-2">
      <Row justify="between" align="center" width="full">
        {onBack ? (
          <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={loading}>
            {texts.action.back}
          </Button>
        ) : null}

        {onPrimaryClick ? (
          <Button type="button" size="lg" onClick={onPrimaryClick} disabled={loading}>
            {continueLabel}
            {continueIcon}
          </Button>
        ) : (
          <SubmitButton type="submit" size="lg" loading={loading} className={cn({ "ml-auto": !onBack })}>
            {continueLabel}
            {continueIcon}
          </SubmitButton>
        )}
      </Row>
      {onSkip ? (
        <Row justify="center" width="full" className="border-t pt-3">
          <Button
            type="button"
            variant="link"
            className="h-auto text-xs font-medium text-muted-foreground"
            onClick={onSkip}
            disabled={loading}
          >
            {skipLabel}
          </Button>
        </Row>
      ) : null}
    </Column>
  );
}
