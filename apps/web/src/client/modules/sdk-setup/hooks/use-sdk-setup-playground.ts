import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { useCallback } from "react";

import { buildPlaygroundHref, playgroundIngestHost } from "@/client/modules/sdk-setup/utils/build-playground-href.util";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useFindProjectWidgetSetting } from "@/client/modules/shared/queries/use-find-project-widget-setting";
import { useUpdateProjectWidgetSetting } from "@/client/modules/shared/queries/use-update-project-widget-setting";
import { publicEnv } from "@/shared/env.public.schema";

export function useSdkSetupPlayground(projectId: string) {
  const { data: settings } = useFindProjectWidgetSetting({ projectId });
  const { data: membership } = useFindMembershipByUser();
  const { mutateAsync: saveSettings, isPending } = useUpdateProjectWidgetSetting(projectId);

  const host = playgroundIngestHost(publicEnv.NEXT_PUBLIC_PLAYGROUND_URL);
  const allowsAnyOrigin = settings.allowedDomains.length === 0;
  const hostAllowed = allowsAnyOrigin || settings.allowedDomains.includes(host);
  const isAdmin = membership?.role === UserRole.ADMIN;

  const allowHost = useCallback(async () => {
    if (!isAdmin || hostAllowed || settings.allowedDomains.includes(host)) return;

    await saveSettings({
      projectId,
      settings: { ...settings, allowedDomains: [...settings.allowedDomains, host] },
    });
  }, [host, hostAllowed, isAdmin, projectId, saveSettings, settings]);

  return {
    host,
    allowsAnyOrigin,
    hostAllowed,
    isAdmin,
    isPending,
    allowHost,
    playgroundHref: buildPlaygroundHref(publicEnv.NEXT_PUBLIC_PLAYGROUND_URL),
  };
}
