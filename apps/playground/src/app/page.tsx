"use client";

import { Column } from "@workspace/design-system/components/layout/column";

import { PlaygroundApiKeyForm } from "@/client/modules/sdk/components/playground-api-key-form";
import { PlaygroundHeader } from "@/client/modules/shared/components/playground-header";
import { SignupContent } from "@/client/modules/signup/components/signup-content";

export default function Page() {
  return (
    <Column width="full" gap="xl" padding="lg" className="mx-auto min-h-dvh max-w-md">
      <PlaygroundHeader />
      <PlaygroundApiKeyForm />
      <Column width="full" justify="center" className="flex-1">
        <SignupContent />
      </Column>
    </Column>
  );
}
