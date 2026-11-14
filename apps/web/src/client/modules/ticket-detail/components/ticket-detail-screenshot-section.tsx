import { Panel } from "@workspace/design-system/components/ui/panel";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CameraIcon } from "lucide-react";
import Image from "next/image";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { buildBugReportScreenshotUrl } from "@/client/modules/ticket-detail/utils/build-bug-report-screenshot-url.util";

type TicketDetailScreenshotSectionProps = {
  shortId: string;
};

export function TicketDetailScreenshotSection({ shortId }: TicketDetailScreenshotSectionProps) {
  const { data: ticket } = useFindBugReport({ shortId });

  return (
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.screenshot.title} icon={CameraIcon} />
      <Panel.Content>
        {ticket.hasScreenshot ? (
          <Image
            src={buildBugReportScreenshotUrl(shortId)}
            alt={texts.screenshot.imageAlt}
            unoptimized
            width={ticket.viewportWidth ?? 1280}
            height={ticket.viewportHeight ?? 800}
            className="h-auto w-full max-w-full rounded-md border border-border"
          />
        ) : (
          <Typography variant="text-sm" color="muted">
            {texts.screenshot.empty}
          </Typography>
        )}
      </Panel.Content>
    </Panel>
  );
}
