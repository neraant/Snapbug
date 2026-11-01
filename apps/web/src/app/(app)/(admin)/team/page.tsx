"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Button } from "@workspace/design-system/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { Suspense } from "react";

import { InvitePeopleDialog } from "@/client/modules/team/components/invite-people-dialog";
import { Team } from "@/client/modules/team/components/team";
import { texts } from "@/client/modules/team/consts/texts.const";

export default function Page() {
  return (
    <PageContainer
      title={texts.title}
      actions={
        <Suspense
          fallback={
            <Button disabled>
              <UserPlusIcon />
              {texts.invite.action}
            </Button>
          }
        >
          <InvitePeopleDialog />
        </Suspense>
      }
    >
      <Suspense fallback={<Team.Fallback />}>
        <Team />
      </Suspense>
    </PageContainer>
  );
}
