import { Code } from "@workspace/design-system/components/ui/code";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

import { SdkSetupRotateApiKeyDialog } from "@/client/modules/sdk-setup/components/sdk-setup-rotate-api-key-dialog";
import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useFindProjectApiKey } from "@/client/modules/shared/queries/use-find-project-api-key";

type SdkSetupApiKeyCardProps = {
  projectId: string;
};

export function SdkSetupApiKeyCard({ projectId }: SdkSetupApiKeyCardProps) {
  const { data } = useFindProjectApiKey({ projectId });
  const { data: membership } = useFindMembershipByUser();
  const isAdmin = membership?.role === UserRole.ADMIN;

  const createdLabel = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Panel>
      <Panel.Header
        title={texts.apiKey.title}
        action={isAdmin ? <SdkSetupRotateApiKeyDialog projectId={projectId} /> : undefined}
      />
      <Panel.Content gap="md">
        <Code code={data.key} showCopy={false} />
        {/* TODO: last-used metadata */}
        <Typography variant="text-xs" color="muted">
          {texts.apiKey.created(createdLabel)}
        </Typography>
      </Panel.Content>
    </Panel>
  );
}

function SdkSetupApiKeyCardFallback() {
  return <Skeleton className="h-42.5" />;
}

SdkSetupApiKeyCard.Fallback = SdkSetupApiKeyCardFallback;
