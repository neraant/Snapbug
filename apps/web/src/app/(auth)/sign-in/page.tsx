"use client";

import { Center } from "@workspace/design-system/components/layout/center";

import { SignInForm } from "@/client/modules/auth/components/sign-in-form";

export default function Page() {
  return (
    <Center>
      <SignInForm />
    </Center>
  );
}
