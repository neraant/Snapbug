import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Progress } from "@workspace/design-system/components/ui/progress";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/onboarding/consts/texts.const";

type OnboardingStepProgressProps = {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
};

export function OnboardingStepProgress({ currentStep, totalSteps, stepLabel }: OnboardingStepProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <Column width="full" gap="sm">
      <Row justify="between" align="center" width="full" wrap={false} minWidth="0">
        <Row gap="sm" align="center" wrap={false} minWidth="0">
          <Typography variant="text-xs" weight="semibold" color="muted">
            {texts.step.of(currentStep, totalSteps)}
          </Typography>
          <Typography variant="text-xs" weight="semibold" color="muted">
            — {stepLabel}
          </Typography>
        </Row>
        <Typography variant="text-xs" weight="semibold" className="font-mono text-primary">
          {percent}%
        </Typography>
      </Row>
      <Progress value={percent} aria-label={`Onboarding progress, ${percent} percent`} />
    </Column>
  );
}
