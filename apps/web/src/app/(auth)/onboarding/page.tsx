"use client";

import { Suspense } from "react";

import { OnboardingSteps } from "@/client/modules/onboarding/components/onboarding-steps";

export default function Page() {
  return (
    <Suspense fallback={<OnboardingSteps.Fallback />}>
      <OnboardingSteps />
    </Suspense>
  );
}
