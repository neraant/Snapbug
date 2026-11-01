import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { url } from "@/shared/build-url.util";

type TicketBoardEmptyProps = {
  variant: "no-reports" | "filtered";
  projectId: string | null;
  onClearFilters: () => void;
};

export function TicketBoardEmpty({ variant, projectId, onClearFilters }: TicketBoardEmptyProps) {
  if (variant === "filtered") {
    return (
      <Column align="center" gap="sm" padding="lg">
        <Typography variant="heading-xs">{texts.empty.filteredTitle}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.empty.filteredDescription}
        </Typography>
        <Button variant="outline" onClick={onClearFilters}>
          {texts.filter.clear}
        </Button>
      </Column>
    );
  }

  const sdkHref = buildPathWithProjectScopeSearchParam(url.sdk(), projectId);

  return (
    <Column align="center" gap="sm" padding="lg">
      <Typography variant="heading-xs">{texts.empty.noReportsTitle}</Typography>
      <Typography variant="text-sm" color="muted">
        {texts.empty.noReportsDescription}
      </Typography>
      <Button nativeButton={false} render={<Link href={sdkHref} />}>
        {texts.empty.sdkSetupLink}
      </Button>
    </Column>
  );
}
