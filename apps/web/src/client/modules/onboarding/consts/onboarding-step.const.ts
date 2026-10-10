import { texts } from "@/client/modules/onboarding/consts/texts.const";

export const onboardingStepLabelByNumber: Record<number, string> = {
  1: texts.step.organization,
  2: texts.step.project,
  3: texts.step.teammate,
};

export function onboardingStepLabel(step: number): string {
  return onboardingStepLabelByNumber[step] ?? texts.step.organization;
}
