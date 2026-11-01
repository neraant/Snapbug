import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { CheckIcon, CopyIcon } from "lucide-react";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type TicketDetailCopyableUrlValueProps = {
  url: string;
};

export function TicketDetailCopyableUrlValue({ url }: TicketDetailCopyableUrlValueProps) {
  const { copied, copy } = useCopyText();

  return (
    <Row align="center" justify="end" gap="xs" wrap={false} minWidth="0" className="group/copyable-url min-w-0">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-focus-within/copyable-url:opacity-100 group-hover/copyable-url:opacity-100 focus-visible:opacity-100"
              aria-label={copied ? texts.sidebar.copiedUrl : texts.sidebar.copyUrl}
              onClick={() => {
                copy(url).catch(() => undefined);
              }}
            >
              {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
            </Button>
          }
        />
        <TooltipContent>{copied ? texts.sidebar.copiedUrl : texts.sidebar.copyUrl}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Typography variant="text-xs" align="right" className="max-w-48 min-w-0 truncate">
              {url}
            </Typography>
          }
        />
        <TooltipContent>{url}</TooltipContent>
      </Tooltip>
    </Row>
  );
}
