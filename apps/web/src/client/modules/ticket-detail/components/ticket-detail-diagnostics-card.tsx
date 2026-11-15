import { LogViewer } from "@workspace/design-system/components/ui/log-viewer";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { ActivityIcon, BracesIcon, GlobeIcon, TerminalIcon } from "lucide-react";
import { useState } from "react";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import {
  type TicketDetailDiagnosticsTab,
  ticketDetailDiagnosticsTabs,
} from "@/client/modules/ticket-detail/consts/ticket-detail-diagnostics-tab.const";
import {
  formatTicketDetailConsoleLogs,
  formatTicketDetailCustomContext,
  formatTicketDetailNetworkLogs,
} from "@/client/modules/ticket-detail/utils/format-ticket-detail-diagnostics.util";

const diagnosticsTabItems = [
  {
    value: ticketDetailDiagnosticsTabs.console,
    get label() {
      return texts.diagnostics.console;
    },
    icon: TerminalIcon,
  },
  {
    value: ticketDetailDiagnosticsTabs.network,
    get label() {
      return texts.diagnostics.network;
    },
    icon: GlobeIcon,
  },
  {
    value: ticketDetailDiagnosticsTabs.customContext,
    get label() {
      return texts.diagnostics.customContext;
    },
    icon: BracesIcon,
  },
];

type TicketDetailDiagnosticsCardProps = {
  shortId: string;
};

export function TicketDetailDiagnosticsCard({ shortId }: TicketDetailDiagnosticsCardProps) {
  const { data: ticket } = useFindBugReport({ shortId });
  const [activeTab, setActiveTab] = useState<TicketDetailDiagnosticsTab>(ticketDetailDiagnosticsTabs.console);

  const consoleEntries = formatTicketDetailConsoleLogs(ticket.consoleLogs);
  const networkEntries = formatTicketDetailNetworkLogs(ticket.networkLogs);
  const customContextEntries = formatTicketDetailCustomContext(ticket.customContext);

  const emptyLabel =
    activeTab === ticketDetailDiagnosticsTabs.console
      ? texts.diagnostics.emptyConsole
      : activeTab === ticketDetailDiagnosticsTabs.network
        ? texts.diagnostics.emptyNetwork
        : texts.diagnostics.emptyCustomContext;

  const entries =
    activeTab === ticketDetailDiagnosticsTabs.console
      ? consoleEntries
      : activeTab === ticketDetailDiagnosticsTabs.network
        ? networkEntries
        : customContextEntries;

  return (
    <Panel width="full" minWidth="0">
      <Panel.Header
        title={texts.diagnostics.title}
        icon={ActivityIcon}
        action={
          <SegmentedControl
            aria-label={texts.diagnostics.ariaLabel}
            variant="muted"
            size="sm"
            value={activeTab}
            items={diagnosticsTabItems}
            onValueChange={(value) => setActiveTab(value as TicketDetailDiagnosticsTab)}
          />
        }
      />
      <Panel.Content>
        <LogViewer entries={entries} emptyLabel={emptyLabel} />
      </Panel.Content>
    </Panel>
  );
}
