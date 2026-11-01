import { Column } from "@workspace/design-system/components/layout/column";
import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/project/consts/texts.const";

type ProjectListEmptyProps = {
  variant: "none" | "filtered";
};

export function ProjectListEmpty({ variant }: ProjectListEmptyProps) {
  const copy = variant === "filtered" ? texts.emptyFiltered : texts.empty;

  return (
    <Column align="center" gap="sm" padding="lg" width="full">
      <Typography variant="heading-xs">{copy.title}</Typography>
      <Typography variant="text-sm" color="muted">
        {copy.description}
      </Typography>
    </Column>
  );
}
