"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useState } from "react";

import { SignupForm } from "@/client/modules/signup/components/signup-form";
import { SignupSuccess } from "@/client/modules/signup/components/signup-success";
import { texts } from "@/client/modules/signup/consts/texts.const";
import type { SignupUserType } from "@/shared/signup/signup.schema";

export function SignupContent() {
  const [user, setUser] = useState<SignupUserType | null>(null);

  if (user) {
    return <SignupSuccess user={user} onReset={() => setUser(null)} />;
  }

  return (
    <Column width="full" gap="lg">
      <Column width="full" gap="xs">
        <Typography variant="heading-lg">{texts.signup.title}</Typography>
        <Typography variant="text-md" color="muted">
          {texts.signup.description}
        </Typography>
      </Column>
      <SignupForm onSignedUp={setUser} />
    </Column>
  );
}
