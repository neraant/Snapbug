"use client";

import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Suspense } from "react";

import { OnboardingSteps } from "@/client/modules/onboarding/components/onboarding-steps";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-100" />}>
      <OnboardingSteps />
    </Suspense>
  );
}
