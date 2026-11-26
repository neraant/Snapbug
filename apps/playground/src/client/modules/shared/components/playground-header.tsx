import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { BugIcon } from "lucide-react";

import { texts } from "@/client/modules/shared/consts/texts.const";

export function PlaygroundHeader() {
  return (
    <Row align="center" gap="sm" width="full" wrap={false} minWidth="0">
      <Avatar variant="brand">
        <AvatarFallback>
          <BugIcon className="size-5" />
        </AvatarFallback>
      </Avatar>
      <Column gap="none" align="start" minWidth="0">
        <Typography variant="label">{texts.brand.name}</Typography>
        <Typography variant="text-sm" color="muted">
          {texts.brand.tagline}
        </Typography>
      </Column>
    </Row>
  );
}
