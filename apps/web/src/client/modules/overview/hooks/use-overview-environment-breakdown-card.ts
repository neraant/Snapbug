import type { SegmentedControlItem } from "@workspace/design-system/components/ui/segmented-control";
import type { FindBreakdownsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import { Globe, Monitor, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";

import {
  environmentBreakdownDimensions,
  type EnvironmentBreakdownDimensionType,
} from "@/client/modules/overview/consts/environment-breakdown.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import { mapEnvironmentToBarListItems } from "@/client/modules/overview/utils/map-environment-to-bar-list-items.util";

const environmentDimensionIcon = {
  browser: Globe,
  os: Monitor,
  device: Smartphone,
} as const;

type UseOverviewEnvironmentBreakdownCardInput = {
  breakdowns: FindBreakdownsOutputDtoType;
};

export function useOverviewEnvironmentBreakdownCard({ breakdowns }: UseOverviewEnvironmentBreakdownCardInput) {
  const [dimension, setDimension] = useState<EnvironmentBreakdownDimensionType>("browser");

  const segmentedItems = useMemo<SegmentedControlItem[]>(
    () =>
      environmentBreakdownDimensions.map((value) => ({
        value,
        label: texts.breakdown.environment.segmentLabels[value],
      })),
    [],
  );

  const environment = breakdowns[dimension];

  const barItems = useMemo(
    () =>
      mapEnvironmentToBarListItems(
        environment,
        environmentDimensionIcon[dimension],
        texts.breakdown.environment.formatShare,
      ),
    [dimension, environment],
  );

  return {
    dimension,
    setDimension,
    segmentedItems,
    environment,
    barItems,
  };
}
