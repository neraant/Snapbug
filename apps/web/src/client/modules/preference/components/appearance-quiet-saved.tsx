import { Row } from "@workspace/design-system/components/layout/row";
import { SettingsSectionFormFooter } from "@workspace/design-system/components/layout/settings-section";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon } from "lucide-react";

import { texts } from "@/client/modules/preference/consts/texts.const";

type AppearanceQuietSavedProps = {
  visible: boolean;
};

export function AppearanceQuietSaved({ visible }: AppearanceQuietSavedProps) {
  if (!visible) return null;

  return (
    <SettingsSectionFormFooter>
      <Row gap="xs" align="center">
        <CheckIcon className="size-4 text-success" aria-hidden="true" />
        <Typography variant="text-sm" color="muted">
          {texts.saved}
        </Typography>
      </Row>
    </SettingsSectionFormFooter>
  );
}
