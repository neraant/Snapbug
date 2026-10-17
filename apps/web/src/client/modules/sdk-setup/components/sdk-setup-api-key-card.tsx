import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import { useFindProjectApiKey } from "@/client/shared/queries/use-find-project-api-key";

type SdkSetupApiKeyCardProps = {
  projectId: string;
};

export function SdkSetupApiKeyCard({ projectId }: SdkSetupApiKeyCardProps) {
  const { data } = useFindProjectApiKey({ projectId });
  const [visible, setVisible] = useState(false);
  const { copied, copy } = useCopyText();

  const maskedKey = data.key.replace(/.(?=.{4})/g, "•");
  const createdLabel = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <MetricCard>
      <MetricCard.Header
        title={texts.apiKey.title}
        action={
          <Row align="center" gap="sm" wrap={false}>
            <Button
              type="button"
              variant="muted"
              size="icon-sm"
              aria-label={visible ? texts.apiKey.hide : texts.apiKey.show}
              onClick={() => setVisible((current) => !current)}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
            <CopyButton
              copied={copied}
              onCopy={() => copy(data.key)}
              copyLabel={texts.apiKey.copy}
              copiedLabel={texts.apiKey.copied}
              variant="muted"
              size="sm"
            />
          </Row>
        }
      />
      <MetricCard.Content gap="md">
        <Code code={visible ? data.key : maskedKey} showCopy={false} />
        {/* TODO: Regenerate key modal and last-used metadata */}
        <Typography variant="text-xs" color="muted">
          {texts.apiKey.created(createdLabel)}
        </Typography>
      </MetricCard.Content>
    </MetricCard>
  );
}

function SdkSetupApiKeyCardFallback() {
  return <Skeleton className="h-36 w-full" />;
}

SdkSetupApiKeyCard.Fallback = SdkSetupApiKeyCardFallback;
