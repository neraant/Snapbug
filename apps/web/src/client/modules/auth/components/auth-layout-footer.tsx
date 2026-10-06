import { Typography } from "@workspace/design-system/components/ui/typography";

import { texts } from "@/client/modules/auth/consts/texts.const";

export function AuthLayoutFooter() {
  return (
    <Typography variant="text-sm" color="muted">
      {texts.auth.copyright(new Date().getFullYear().toString())}
    </Typography>
  );
}
