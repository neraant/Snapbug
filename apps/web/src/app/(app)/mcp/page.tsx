"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense } from "react";

import { CreateUserTokenDialog } from "@/client/modules/user-token/components/create-user-token-dialog";
import { UserTokenList } from "@/client/modules/user-token/components/user-token-list";
import { texts } from "@/client/modules/user-token/consts/texts.const";

export default function Page() {
  return (
    <PageContainer title={texts.title} description={texts.description} actions={<CreateUserTokenDialog />}>
      <Suspense fallback={<UserTokenList.Fallback />}>
        <UserTokenList />
      </Suspense>
    </PageContainer>
  );
}
