import { texts } from "@/client/modules/onboarding/consts/texts.const";

export const onboardingStepLabelByNumber: Record<number, string> = {
  get 1() {
    return texts.step.organization;
  },
  get 2() {
    return texts.step.project;
  },
  get 3() {
    return texts.step.teammate;
  },
};

export function onboardingStepLabel(step: number): string {
  return onboardingStepLabelByNumber[step] ?? texts.step.organization;
}
