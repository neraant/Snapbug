import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useMemo, useState } from "react";

import { useActiveOrganizationId } from "@/client/modules/shared/hooks/use-active-organization-id";
import { useSelectActiveOrganization } from "@/client/modules/shared/hooks/use-select-active-organization";
import { useFindOrganizations } from "@/client/modules/shared/queries/use-find-organizations";
import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";

export function useAppSidebarOrganizationSwitcher() {
  const activeOrganizationId = useActiveOrganizationId();
  const { data: organizations } = useFindOrganizations();
  const { selectOrganization } = useSelectActiveOrganization();
  const [createOpen, setCreateOpen] = useState(false);

  const sortedOrganizations = useMemo(
    () => [...organizations].sort((left, right) => left.name.localeCompare(right.name)),
    [organizations],
  );

  const activeOrganization = sortedOrganizations.find(
    (organization) => organization.organizationId === activeOrganizationId,
  );

  const label = activeOrganization?.name ?? sortedOrganizations[0]?.name ?? texts.organization.empty;

  const chooseOrganization = async (organizationId: string) => {
    if (organizationId === activeOrganizationId) return;

    try {
      await selectOrganization(organizationId);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.switchError),
        type: "error",
      });
    }
  };

  return {
    activeOrganizationId: activeOrganization?.organizationId ?? activeOrganizationId,
    chooseOrganization,
    createOpen,
    label,
    setCreateOpen,
    sortedOrganizations,
  };
}
