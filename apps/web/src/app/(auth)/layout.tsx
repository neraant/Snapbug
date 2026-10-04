import { Column } from "@workspace/design-system/components/layout/column";
import type { PropsWithChildren } from "react";

import { AuthLayoutAside } from "@/client/modules/auth/components/auth-layout-aside";
import { AuthLayoutFooter } from "@/client/modules/auth/components/auth-layout-footer";
import { AuthLayoutHeader } from "@/client/modules/auth/components/auth-layout-header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-dvh min-h-0 grid-cols-1 lg:grid-cols-2">
      <Column width="full" className="min-h-0 overflow-y-auto">
        <Column width="full" gap="xl" padding="lg" className="mx-auto min-h-dvh max-w-md">
          <AuthLayoutHeader />
          <Column width="full" justify="center" className="flex-1">
            {children}
          </Column>
          <AuthLayoutFooter />
        </Column>
      </Column>
      <AuthLayoutAside />
    </div>
  );
}
