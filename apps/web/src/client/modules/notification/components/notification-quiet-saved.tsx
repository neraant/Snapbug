import { Row } from "@workspace/design-system/components/layout/row";
import { SettingsSectionFormFooter } from "@workspace/design-system/components/layout/settings-section";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CheckIcon } from "lucide-react";

import { texts } from "@/client/modules/notification/consts/texts.const";

type NotificationQuietSavedProps = {
  visible: boolean;
};

export function NotificationQuietSaved({ visible }: NotificationQuietSavedProps) {
  if (!visible) return null;

  return (
    <SettingsSectionFormFooter>
      <Row gap="xs" align="center">
        <CheckIcon className="size-4 text-success" aria-hidden="true" />
        <Typography variant="text-sm" color="muted">
          {texts.settings.saved}
        </Typography>
      </Row>
    </SettingsSectionFormFooter>
  );
}