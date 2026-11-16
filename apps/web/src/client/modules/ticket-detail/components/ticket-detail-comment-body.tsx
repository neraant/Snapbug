import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Markdown } from "@workspace/design-system/components/ui/markdown";
import { cn } from "@workspace/design-system/lib/utils";
import { useLayoutEffect, useRef, useState } from "react";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

const collapsedMaxHeightPx = 192;

type TicketDetailCommentBodyProps = {
  body: string;
};

export function TicketDetailCommentBody({ body }: TicketDetailCommentBodyProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [collapsible, setCollapsible] = useState(false);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    setCollapsible(element.scrollHeight > collapsedMaxHeightPx);
  }, [body]);

  return (
    <Column gap="xs" width="full" minWidth="0">
      <div
        ref={contentRef}
        className={cn(
          "min-w-0 overflow-hidden transition-[max-height] duration-200 ease-out",
          !expanded && collapsible && "max-h-48",
        )}
      >
        <Markdown source={body} />
      </div>
      {collapsible ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto self-start px-0"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? texts.comments.showLess : texts.comments.showMore}
        </Button>
      ) : null}
    </Column>
  );
}
