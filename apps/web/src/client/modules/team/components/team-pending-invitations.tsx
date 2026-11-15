import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { Suspense } from "react";

import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { PendingInvitations } from "@/client/modules/team/components/pending-invitations";

export function TeamPendingInvitations() {
  const { data: membership } = useFindMembershipByUser();

  if (membership?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <Suspense fallback={<PendingInvitations.Fallback />}>
      <PendingInvitations />
    </Suspense>
  );
}