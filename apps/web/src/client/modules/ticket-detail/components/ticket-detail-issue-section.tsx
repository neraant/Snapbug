import { Column } from "@workspace/design-system/components/layout/column";
import { Markdown } from "@workspace/design-system/components/ui/markdown";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { FileTextIcon } from "lucide-react";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type TicketDetailIssueSectionProps = {
  shortId: string;
};

export function TicketDetailIssueSection({ shortId }: TicketDetailIssueSectionProps) {
  const { data: ticket } = useFindBugReport({ shortId });
  const description = ticket.description.trim();

  return (
    <Column gap="lg" width="full" minWidth="0">
      <Panel width="full" minWidth="0">
        <Panel.Header title={texts.issue.descriptionTitle} icon={FileTextIcon} />
        <Panel.Content>
          {description ? (
            <Markdown source={description} />
          ) : (
            <Typography variant="text-sm" color="muted">
              {texts.issue.emptyDescription}
            </Typography>
          )}
        </Panel.Content>
      </Panel>
    </Column>
  );
}
